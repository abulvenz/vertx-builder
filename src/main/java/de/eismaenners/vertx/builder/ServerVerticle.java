/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.eismaenners.vertx.builder;

import io.vertx.core.AbstractVerticle;
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

        System.out.println("WEBROOT " + System.getProperty("user.dir"));

        router.route("/scripts/*").handler(StaticHandler.create("node_modules"));
        router.route()
                .handler(StaticHandler
                        .create(WEBROOT)
                        .setCachingEnabled(false)
                        .setIndexPage("index.html"))
                .failureHandler(ctx -> ctx.reroute("/"));

        vertx.createHttpServer().requestHandler(router::accept).listen(8888);
    }

}
