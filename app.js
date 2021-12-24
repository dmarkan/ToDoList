const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://darko:darmar1986@cluster0.62x42.mongodb.net/todolistDB?retryWrites=true&w=majority");

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema); 

const item1 = new Item ({
    name: "Welcome to your todoList!"
});

const item2 = new Item ({
    name: "Hit the + button to add a new item."
});

const item3 = new Item ({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

app.get("/", function (req, res) {

    Item.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully saved items into the DB");
                }
            });
            res.redirect("/");
        } else {
        res.render('list', {
            listTitle: "Today", newListItems: foundItems
        });
    }
    });
   
    app.post("/", function (req, res) {
        const itemName = req.body.newItem;
        
        const item = new Item ({
            name: itemName
        });

        item.save();
        res.redirect("/");
    })

    app.post("/delete", function (req, res) {
        const checkedItemId = req.body.checkbox;
        Item.findByIdAndRemove(checkedItemId, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("item successfully removed");
                res.redirect("/");
            }
    });
})
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Server has started successfully");
})