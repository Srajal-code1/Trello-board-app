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
const ORGANIZATIONS = [];
const BOARDS = [];
const ISSUES = [];

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

// only the admin of an org can create a board in it
app.post("/board", authMiddleware, (req, res) => {
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const title = req.body.title;

    const organization = ORGANIZATIONS.find(org => org.id === organizationId);

    if(!organization || organization.admin !== userId) {
        res.status(411).json({
            msg: "Either this org does not exist or you or not an admin of this org"
        })
        return
    }

    BOARDS.push({
        id: BOARDS_ID++,
        title,
        organizationId
    })

    res.json({
        msg: "Board created",
        id: BOARDS_ID - 1
    })
})

// admin or any member of the board's org can create an issue
app.post("/issue", authMiddleware, (req, res) => {
    const userId = req.userId;
    const boardId = req.body.boardId;
    const title = req.body.title;

    const board = BOARDS.find(b => b.id === boardId);

    if(!board) {
        res.status(411).json({
            msg: "No board with this id exists"
        })
        return
    }

    const organization = ORGANIZATIONS.find(org => org.id === board.organizationId);

    if(!organization || (organization.admin !== userId && !organization.members.includes(userId))) {
        res.status(411).json({
            msg: "You are not a part of this org"
        })
        return
    }

    ISSUES.push({
        id: ISSUES_ID++,
        title,
        boardId,
        state: "NEXT_UP"
    })

    res.json({
        msg: "Issue created",
        id: ISSUES_ID - 1
    })
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
// GET /boards?organizationId=1
app.get("/boards", authMiddleware, (req, res) => {
    const userId = req.userId;
    const organizationId = parseInt(req.query.organizationId);

    const organization = ORGANIZATIONS.find(org => org.id === organizationId);

    if(!organization || (organization.admin !== userId && !organization.members.includes(userId))) {
        res.status(411).json({
            msg: "Either this org does not exist or you are not a part of this org"
        })
        return
    }

    const boards = BOARDS.filter(board => board.organizationId === organizationId);

    res.json({
        boards
    })
})

// GET /issues?boardId=1
app.get("/issues", authMiddleware, (req, res) => {
    const userId = req.userId;
    const boardId = parseInt(req.query.boardId);

    const board = BOARDS.find(b => b.id === boardId);

    if(!board) {
        res.status(411).json({
            msg: "No board with this id exists"
        })
        return
    }

    const organization = ORGANIZATIONS.find(org => org.id === board.organizationId);

    if(!organization || (organization.admin !== userId && !organization.members.includes(userId))) {
        res.status(411).json({
            msg: "You are not a part of this org"
        })
        return
    }

    const issues = ISSUES.filter(issue => issue.boardId === boardId);

    res.json({
        issues
    })
})

// GET /members?organizationId=1
app.get("/members", authMiddleware, (req, res) => {
    const userId = req.userId;
    const organizationId = parseInt(req.query.organizationId);

    const organization = ORGANIZATIONS.find(org => org.id === organizationId);

    if(!organization || (organization.admin !== userId && !organization.members.includes(userId))) {
        res.status(411).json({
            msg: "Either this org does not exist or you are not a part of this org"
        })
        return
    }

    const members = organization.members.map(memberId => {
        const user = USERS.find(u => u.id === memberId);
        return {
            id: user.id,
            username: user.username
        }
    })

    res.json({
        members
    })
})

// UPDATE
// move an issue to a different state, e.g. NEXT_UP -> IN_PROGRESS
app.put("/issues", authMiddleware, (req, res) => {
    const userId = req.userId;
    const issueId = req.body.issueId;
    const state = req.body.state;

    const ALLOWED_STATES = ["NEXT_UP", "IN_PROGRESS", "DONE", "ARCHIVED"];

    if(!ALLOWED_STATES.includes(state)) {
        res.status(411).json({
            msg: "State must be one of " + ALLOWED_STATES.join(", ")
        })
        return
    }

    const issue = ISSUES.find(i => i.id === issueId);

    if(!issue) {
        res.status(411).json({
            msg: "No issue with this id exists"
        })
        return
    }

    const board = BOARDS.find(b => b.id === issue.boardId);
    const organization = board && ORGANIZATIONS.find(org => org.id === board.organizationId);

    if(!organization || (organization.admin !== userId && !organization.members.includes(userId))) {
        res.status(411).json({
            msg: "You are not a part of this org"
        })
        return
    }

    issue.state = state;

    res.json({
        msg: "Issue updated",
        issue
    })
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