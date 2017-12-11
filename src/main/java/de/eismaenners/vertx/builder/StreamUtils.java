/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.eismaenners.vertx.builder;

import io.vertx.core.json.JsonArray;
import java.util.HashSet;
import java.util.Set;
import java.util.function.BiConsumer;
import java.util.function.BinaryOperator;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collector;

/**
 *
 * @author iceman
 */
public class StreamUtils {

    public static <T> Collector<T, JsonArray, JsonArray> toJsonArray() {
        return new Collector<T, JsonArray, JsonArray>() {
            @Override
            public Supplier<JsonArray> supplier() {
                return JsonArray::new;
            }

            @Override
            public BiConsumer<JsonArray, T> accumulator() {
                return JsonArray::add;
            }

            @Override
            public BinaryOperator<JsonArray> combiner() {
                return JsonArray::addAll;
            }

            @Override
            public Function<JsonArray, JsonArray> finisher() {
                return (a) -> a;
            }

            @Override
            public Set<Collector.Characteristics> characteristics() {
                return new HashSet<>();
            }

        };
    }
}
