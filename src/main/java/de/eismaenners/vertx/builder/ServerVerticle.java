/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.eismaenners.vertx.builder;

import static de.eismaenners.vertx.builder.StreamUtils.toJsonArray;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.StaticHandler;
import java.util.Arrays;
import java.util.List;

/**
 *
 * @author iceman
 */
public class ServerVerticle extends AbstractVerticle {

    public static final String WEBROOT = "src/main/webroot/";

    @Override
    public void start() throws Exception {
        Router router = Router.router(vertx);
        JsonObject config = new JsonObject();

        MongoClient mongoClient = createMongoClient(config);

        System.out.println("WEBROOT " + System.getProperty("user.dir"));

        List<String> asList = Arrays.asList("Hello", "Jona");
        System.out.println("json: " + asList.stream().collect(toJsonArray()).encode());

        router.get("/resource/all").handler(ctx -> {
            mongoClient.getCollections(retrieval -> {
                if (retrieval.succeeded()) {
                    endWithJson(ctx,
                            200,
                            "All collections.",
                            retrieval.result().stream().collect(toJsonArray()).encode()
                    );
                } else {
                    end(ctx, 500, "Request failed");
                }
            });
        });

        router.get("/resource/:collection/").handler(ctx -> {
            JsonObject query = new JsonObject();
            final String paramCollection = ctx.request().getParam("collection");
            mongoClient.find(paramCollection, query, result -> {
                endWithJson(ctx,
                        200,
                        "Collection " + paramCollection + " listed.",
                        result.result().stream().collect(toJsonArray()).encode()
                );
            });
        });

        router.get("/resource/:collection/:id").handler(ctx -> {
            JsonObject query = new JsonObject();
            final String paramID = ctx.request().getParam("id");
            final String paramCollection = ctx.request().getParam("collection");
            query.put("_id", paramID);
            JsonObject projection = new JsonObject();
            mongoClient.findOne(paramCollection, query, projection, result -> {
                if (!result.succeeded() || result.result() == null) {
                    end(ctx, 404, "Object " + paramID + " not found in collection " + paramCollection);
                } else {
                    endWithJson(ctx,
                            200,
                            "Object loaded",
                            result.result().encode()
                    );
                }
            });
        });

        router.post("/resource/:collection/").handler(ctx -> {
            final String paramCollection = ctx.request().getParam("collection");

            ctx.request().bodyHandler(buffer -> {
                JsonObject object = buffer.toJsonObject();
                mongoClient.save(paramCollection, object, result -> {
                    if (result.succeeded()) {
                        endWithJson(ctx,
                                200,
                                "Object " + result.result() + " saved in collection " + paramCollection,
                                new JsonObject().put("id", result.result()).encode()
                        );
                    } else {
                        end(ctx, 400, result.cause().toString());
                    }
                });
            });
        });

        router.post("/resource/:collection/search").handler(ctx -> {
            final String paramCollection = ctx.request().getParam("collection");

            ctx.request().bodyHandler(buffer -> {
                JsonObject query = buffer.toJsonObject();
                mongoClient.find(paramCollection, query, result -> {
                    if (result.succeeded()) {
                        endWithJson(ctx,
                                200,
                                "Query to " + paramCollection + " returned " + result.result().size() + " results.",
                                result.result().stream().collect(toJsonArray()).encode()
                        );
                    } else {
                        end(ctx, 400, result.cause().toString());
                    }
                });
            });
        });

        router.delete("/resource/:collection/:id").handler(ctx -> {
            final String paramID = ctx.request().getParam("id");
            final String paramCollection = ctx.request().getParam("collection");
            JsonObject object = new JsonObject().put("_id", paramID);
            mongoClient.removeDocument(paramCollection, object, result -> {
                if (result.succeeded()) {
                    endWithJson(ctx,
                            200,
                            "Object " + result.result() + " saved in collection " + paramCollection,
                            new JsonObject().put("removedCount", result.result().getRemovedCount() + "").encode()
                    );
                } else {
                    end(ctx, 400, result.cause().toString());
                }
            });
        });

        router.route("/scripts/*").handler(StaticHandler.create("node_modules"));
        router.route()
                .handler(StaticHandler
                        .create(WEBROOT)
                        .setCachingEnabled(false)
                        .setIndexPage("index.html"))
                .failureHandler(ctx -> ctx.reroute("/"));

        vertx.createHttpServer().requestHandler(router::accept).listen(8888);
    }

    public void notFound(RoutingContext ctx) {
        end(ctx, 404, "Not found");
    }

    public void badRequest(RoutingContext ctx) {
        end(ctx, 400, "Bad request");
    }

    public void serverError(RoutingContext ctx) {
        end(ctx, 500, "Server error");
    }

    public void endWithJson(RoutingContext ctx, int code, String message, String stringifiedJson) {
        jsonResponse(ctx)
                .setStatusCode(code)
                .setStatusMessage(message)
                .end(stringifiedJson);
    }

    public void end(RoutingContext ctx, int code, String message) {
        ctx.response()
                .setStatusCode(code)
                .setStatusMessage(message)
                .end();
    }

    public HttpServerResponse jsonResponse(RoutingContext ctx) {
        ctx.response().headers().add("Content-Type", "application/json");
        return ctx.response();
    }

    public MongoClient createMongoClient(JsonObject config) {
        String uri = config.getString("mongo_uri");
        if (uri == null) {
            uri = "mongodb://localhost:27017";
        }
        String db = config.getString("vertx-builder");
        if (db == null) {
            db = "test";
        }
        JsonObject mongoconfig = new JsonObject()
                .put("connection_string", uri)
                .put("db_name", db);
        MongoClient mongoClient = MongoClient.createShared(vertx, mongoconfig);
        return mongoClient;
    }

}
