const express = require("express");
// username, passowrd
// organizations
// boards
// issues

const USERS = [{
    id: 1,
    username: "srajal",                                 
    password: "123123"
}];
const ORGANIZATIONS = [{
    id: 1,
    title: "100xdevs",
    description: "Learning coding platform",
    admin: 1,
    members: [2]
}];
const BOARDS = [{
    id: 1,
    title: "100xschool website frontend",
    organizationId: 1
}];
const ISSUES = [{
    id: 1,
    title: "Add dark mode",
    boardId: 1,
    state: "IN_PROGRESS"  // NEXT_UP | "IN_PROGRESS" | "DONE" | ARCHIVED
},];

const app = express();
// CREATE
app.post("/signup", (req, res) => {
    const username = req.body.username
    const password = req.body.password

    const userExists = USERS.find(u => u.username === username);
    if(userExists) {
        res.send(411).json({
            msg: "user with this username already exists"
        })
        return;
    }
})

app.post("/signin", (req, res) => {
    
})

app.post("/organization", (req, res) => {
    
})

app.post("/add-member-to-organization", (req, res) => {
    
})

app.post("/board", (req, res) => {
    
})

app.post("/issue", (req, res) => {
    
})

// READ
app.get("/boards", (req, res) => {

})

app.get("/issues", (res, res) => {

})

app.get("/members", (req, res) => {

})

// UPDATE
app.put("/issues", (req, res) => {

})

//DELETE
app.delete("/members", (req, res) => {

})
app.listen(3000);