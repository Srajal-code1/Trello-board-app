const express = require("express");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./middleware")
// username, passowrd
// organizations
// boards
// issues

let USERS_ID = 1;
let ORGANIZATION_ID = 1;
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
    const userId = req.userId;
    ORGANIZATIONS.push({
        id: ORGANIZATION_ID++,
        title: req.body.title,
        description: req.body.description,
        admin: userId,
        members: []
    })
    res.json({
        msg: "Org created",
        id: ORGANIZATION_ID - 1
    })
})

app.post("/add-member-to-organization", authMiddleware, (req, res) => {
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memberUserUsername = req.body.memberUserUsername;
    
    const organization = ORGANIZATIONS.find(org => org.id === organizationId);

    if(!organization || organization.admin !== userId) {
        res.status(411).json({
            msg: "Either this org does not exist or you or not an admin of this org"
        })
        return
    }

    const memberUser = USERS.find(u => u.username === memberUserUsername);

    if(!memberUser) {
        res.status(411).json({
            msg: "No user with this username exists in our db"
        })
        return
    }

    organization.members.push(memberUser.id);

    res.json({
        msg: "New member added!"
    })


})

app.post("/board", (req, res) => {
    
})

app.post("/issue", (req, res) => {
    
})

// GET ENDPOINTS
app.get("/organization", authMiddleware, (req, res) => {
    const userId = req.userId;
    const organizationId = parseInt(req.query.organizationId); // "1"

    const organization = ORGANIZATIONS.find(org => org.id === organizationId);  

    console.log(organization);
    console.log(userId);
    if(!organization || organization.admin !== userId) {
        res.status(411).json({
            msg: "Either this org does not exist or you or not an admin of this org"
        })
        return
    }

    res.json({
        organization: {
            ...organization,
            members: organization.members.map(memberId => {
                const user = USERS.find(user => user.id === memberId);
                return {
                    id: user.id,
                    username: user.username
                }
            })
        }
    })
})
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
app.delete("/members", authMiddleware, (req, res) => {
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memberUserUsername = req.body.memberUserUsername;

    const organization = ORGANIZATIONS.find(org => org.id === organizationId);

    if(!organization || organization.admin !== userId) {
        res.status(411).json({
            msg: "Either this org does not exist or you or not an admin of this org"
        })
        return
    }

    const memberUser = USERS.find(u => u.username === memberUserUsername);

    if(!memberUser) {
        res.status(411).json({
            msg: "No user with this username exists in our db"
        })
        return
    }

    organization.members = organization.members.filter(memberId => memberId !== memberUser.id);

    res.json({
        msg: "Member deleted!"
    })
})
app.listen(3000);