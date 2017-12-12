let store = {
    "store": {
        "book": [
            {"category": "reference",
                "author": "Nigel Rees",
                "title": "Sayings of the Century",
                "price": 8.95,
                "flag": "http://www.androidbegin.com/tutorial/flag/china.png"
            },
            {"category": "fiction",
                "author": "Evelyn Waugh",
                "title": "Sword of Honour",
                "price": 12.99,
                "flag": "http://www.androidbegin.com/tutorial/flag/india.png"
            },
            {"category": "fiction",
                "author": "Herman Melville",
                "title": "Moby Dick",
                "isbn": "0-553-21311-3",
                "price": 8.99,
                "flag": "http://www.androidbegin.com/tutorial/flag/unitedstates.png"
            },
            {"category": "fiction",
                "author": "J. R. R. Tolkien",
                "title": "The Lord of the Rings",
                "isbn": "0-395-19395-8",
                "price": 22.99,
                "flag": "http://www.androidbegin.com/tutorial/flag/japan.png"
            }
        ],
        "bicycle": {
            "color": "red",
            "price": 19.95
        }
    }
};
let data = {// JSON Object
    "worldpopulation": // JSON Array Name
            [// JSON Array
                {// JSON Object
                    "rank": 1, "country": "China",
                    "population": "1,354,040,000",
                    "flag": "http://www.androidbegin.com/tutorial/flag/china.png"
                },
                {// JSON Object
                    "rank": 2, "country": "India",
                    "population": "1,210,193,422",
                    "flag": "http://www.androidbegin.com/tutorial/flag/india.png"
                },
                {// JSON Object
                    "rank": 3, "country": "United States",
                    "population": "315,761,000",
                    "flag": "http://www.androidbegin.com/tutorial/flag/unitedstates.png"
                },
                {// JSON Object
                    "rank": 4, "country": "Indonesia",
                    "population": "237,641,326",
                    "flag": "http://www.androidbegin.com/tutorial/flag/indonesia.png"
                },
                {// JSON Object
                    "rank": 5, "country": "Brazil",
                    "population": "193,946,886",
                    "flag": "http://www.androidbegin.com/tutorial/flag/brazil.png"
                },
                {// JSON Object
                    "rank": 6, "country": "Pakistan",
                    "population": "182,912,000",
                    "flag": "http://www.androidbegin.com/tutorial/flag/pakistan.png"
                },
                {// JSON Object
                    "rank": 7, "country": "Nigeria",
                    "population": "170,901,000",
                    "flag": "http://www.androidbegin.com/tutorial/flag/nigeria.png"
                },
                {// JSON Object
                    "rank": 8, "country": "Bangladesh",
                    "population": "152,518,015",
                    "flag": "http://www.androidbegin.com/tutorial/flag/bangladesh.png"
                },
                {// JSON Object
                    "rank": 9, "country": "Russia",
                    "population": "143,369,806",
                    "flag": "http://www.androidbegin.com/tutorial/flag/russia.png"
                },
                {// JSON Object
                    "rank": 10, "country": "Japan",
                    "population": "127,360,000",
                    "flag": "http://www.androidbegin.com/tutorial/flag/japan.png"
                }
            ] // JSON Array
};
let booktemplate_old = {"tag": "h1", "attrs": {"class": "large-font"}, "text": "@.title"};
let booktemplate = {"tag": "div", "attrs": {"class": "card"}, "children": [{"tag": "div", "attrs": {"class": "card-header"}, "children": ["$.title"]}]};
let cardTemplate = {"tag": "div", "attrs": {"class": "col-md-4"}, "children": [{
            "tag": "div",
            "attrs": {
                "style": {
                    //         "width": "10rem"
                },
                "className": "card card-primary",
            },
            "children": [
                {
                    "tag": "img",
                    "attrs": {
                        "alt": "Card image cap",
                        "src": "$.flag",
                        "className": "card-img-top"
                    },
                    "children": [

                    ],
                    "skip": false
                },
                {
                    "tag": "div",
                    "attrs": {
                        "className": "card-body"
                    },
                    "children": [
                        {
                            "tag": "h4",
                            "attrs": {
                                "className": "card-title"
                            },
                            "text": "$.country",
                            "skip": false
                        },
                        {
                            "tag": "p",
                            "attrs": {
                                "className": "card-text"
                            },
                            "children": [
                                "Population: ",
                                {
                                    tag: 'span',
                                    "text": "$.population",
                                    attrs: {
                                        className: ''
                                    }
                                }
                            ],
                            "skip": false
                        },
                        {
                            "tag": "a",
                            "attrs": {
                                "href": "#",
                                "className": "btn btn-primary"
                            },
                            "text": "Make peace with them all",
                            "skip": false
                        }
                    ],
                    "skip": false
                }
            ],
            "skip": false
        }]};
var datasets = [
    {
        key: 'worldpopulation',
        data: data,
    },
    {
        key: 'store',
        data: store
    },
    {
        key: 'template for card',
        data: cardTemplate
    }
];

export {
datasets,
        data,
        booktemplate_old,
        booktemplate,
        cardTemplate
}