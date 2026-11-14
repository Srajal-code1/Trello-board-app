const express = require("express");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./middleware")
// username, passowrd
// organizations
// boards
// issues

let USERS_ID = 1;
let ORGANIZATIONS_ID = 1;
let BOARDS_ID = 1;
let ISSUES_ID = 1;

const USERS = [];
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
app.use(express.json());
// CREATE
app.post("/signup", (req, res) => {
    const username = req.body.username
    const password = req.body.password

    const userExists = USERS.find(u => u.username === username);
    if(userExists) {
        res.status(411).json({
            msg: "user with this username already exists"
        })
        return;
    }

    USERS.push({
        username,
        password,
        id: USERS_ID++
    })

    res.json({
        msg: "You have signed up successfully"
    })
})

app.post("/signin", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = USERS.find(u => u.username === username && u.password === password);
    if(!userExists) {
        res.status(403).json({
            msg: "Incorrect Credentials"
        })
        return;
    }

    const token = jwt.sign({
        userId: userExists.id
    }, "attlasiansupersecret123123password");
    // create a jwt for the user

    res.json({
        token
    })
})

// AUTHENTICATED ROUTE -- MIDDLEWARE
app.post("/organization", authMiddleware, (req, res) => {
    
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

app.get("/issues", (req, res) => {

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