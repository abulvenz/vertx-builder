/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.eismaenners.vertx.builder;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.StaticHandler;

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

        router.get("/resource/:collection/").handler(ctx -> {
            JsonObject query = new JsonObject();
            mongoClient.find(ctx.request().getParam("collection"), query, result -> {
                ctx.response().headers().add("Content-Type", "application/json");
                ctx.response().setStatusCode(200).end(result.result().stream().collect(JsonArray::new, JsonArray::add, JsonArray::addAll).encode());
            });
        });
        router.get("/resource/:collection/:id").handler(ctx -> {
            JsonObject query = new JsonObject();
            query.put("_id", ctx.request().getParam("id"));
            JsonObject projection = new JsonObject();
            mongoClient.findOne(ctx.request().getParam("collection"), query, projection, result -> {
                if (!result.succeeded() || result.result() == null) {
                    ctx.response()
                            .setStatusCode(404)
                            .setStatusMessage("Object " + ctx.request().getParam("id") + " not found in collection " + ctx.request().getParam("collection"))
                            .end();
                } else {
                    ctx.response()
                            .setStatusCode(200)
                            .end(result.result().encode());
                }
            });
        });

        router.post("/resource/:collection").handler(ctx -> {
            ctx.request().bodyHandler(buffer -> {
                JsonObject object = buffer.toJsonObject();
                mongoClient.save(ctx.request().getParam("collection"), object, result -> {
                    if (result.succeeded()) {
                        ctx.response()
                                .setStatusCode(200)
                                .setStatusMessage("Object " + result.result() + " saved in collection " + ctx.request().getParam("collection"))
                                .end(result.result());
                    } else {
                        ctx.response()
                                .setStatusCode(400)
                                .setStatusMessage(result.cause().toString())
                                .end();
                    }
                });
            });
        });

        router.delete("/resource/:collection/:id").handler(ctx -> {
            JsonObject object = new JsonObject().put("_id", ctx.request().getParam("id"));
            mongoClient.removeDocument(ctx.request().getParam("collection"), object, result -> {
                if (result.succeeded()) {
                    ctx.response()
                            .setStatusCode(200)
                            .setStatusMessage("Object " + result.result() + " saved in collection " + ctx.request().getParam("collection"))
                            .end(result.result().getRemovedCount() + "");
                } else {
                    ctx.response()
                            .setStatusCode(400)
                            .setStatusMessage(result.cause().toString())
                            .end();
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
