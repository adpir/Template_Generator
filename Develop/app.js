const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
// const { finished } = require("stream");

// const ArrayQuestions = [];
let employeesQuestions = [];
function TeamGenerator() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "Role",
        message: "What is your Team Role?",
        choices: ["Manager", "Engineer", "Intern"],
      },
      {
        type: "input",
        name: "name",
        message: "What is your Team Member name?",
      },

      {
        type: "input",
        name: "id",
        message: "What is your Team Member id ?",
      },
      {
        type: "input",
        name: "email",
        message: "What is your Team Member email?",
      },

     
    ])
    .then((response) => {
      console.log(response);
      let SpecialQuestion = [];
      switch (response.Role) {
        case "Manager":
          SpecialQuestion = [
            {
              type: "input",
              name: "Office",
              message: "What is your Team Member Office Number?",
            },
          ];
          break;
        case "Engineer":
          SpecialQuestion = [
            {
              type: "input",
              name: "Github",
              message: "What is your Team Member GitHub Username?",
            },
          ];
          break;
        case "Intern":
          SpecialQuestion = [
            {
              type: "input",
              name: "University",
              message: "What is University your Team Member Graduate?",
            },
          ];
      }
      inquirer.prompt(SpecialQuestion).then((userInput) => {
        switch (response.Role) {
          case "Manager":
            let myManager = new Manager(
              response.name,
              response.id,
              response.email,
              userInput.Office
            );
            employeesQuestions.push(myManager);
            break;
          case "Engineer":
            let myEngineer = new Engineer(
              response.name,
              response.id,
              response.email,
              userInput.Github
            );
            employeesQuestions.push(myEngineer);
            break;
          case "Intern":
            let myIntern = new Intern(
              response.name,
              response.id,
              response.email,
              userInput.University
            );
            employeesQuestions.push(myIntern);
        }
        Complete();
      });
    });
}
function Complete() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "continue",
        message: "Do you wich to add more Team Member?",
        choices: ["Yes", "No"],
      },
    ])
    .then((finished) => {
      switch (finished.continue) {
        case "Yes":
          TeamGenerator();
          break;
        case "No":
          Generatefile();
      }
    });
}
function Generatefile() {
  let readMeText = render(employeesQuestions);
  console.log(readMeText);
  fs.writeFileSync(outputPath, readMeText, (error) => {
    if (error) throw error;
    console.log("team.html");
  });
}

TeamGenerator();
