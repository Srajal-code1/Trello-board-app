const express = require("express");
// username, passowrd
// organizations
// boards
// issues

const users = [{
    id: 1,
    username: "srajal",                                 
    password: "123123"
}, {
    id: 2,
    username: "rahul",
    password: "123123"
}];
const organizations = [{
    id: 1,
    title: "100xdevs",
    description: "Learning coding platform",
    admin: 1,
    members: [2]
}, {
    id: 2,
    title: "rahul org",
    description: "experimenting",
    admin: 1,
    members: []
}];
const boards = [{
    id: 1,
    title: "100xschool website frontend",
    organizationId: 1
}];
const issues = [{
    id: 1,
    title: "Add dark mode",
    boardId: 1
}, {
    id: 2,
    title: "Allow admins to create more courses",
    boardId: 1
}];

const app = express();

app.listen(3000);