/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.eismaenners.vertx.builder;

import io.vertx.core.AbstractVerticle;
import io.vertx.ext.web.Router;

/**
 *
 * @author iceman
 */
public class ServerVerticle extends AbstractVerticle {

    @Override
    public void start() throws Exception {
        Router router = Router.router(vertx);

        router.get("/").handler((ctx) -> {
            ctx.response().end("Hello vertx builder");
        });

        vertx.createHttpServer().requestHandler(router::accept).listen(8888);
    }

}
