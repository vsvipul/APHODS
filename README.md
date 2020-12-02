# APHODS
Automated Project Hosting on Docker Server. Done as a project for CS307- System Practicum.


## Getting Started

Install the Node Package Manager 
```bash
$ sudo apt install npm
$ npm install nodemon -g
```

Fork this repo and clone it
```bash
$ git clone https://github.com/<Your User Name>/APHODS.git
```

cd to the repo directory and install the dependencies
```bash
$ npm install
```

Initialize the sqlite database using
```bash
$ node init_db.js
```

Run the application
```bash
$ nodemon
```

The server runs at port 24020 i.e. http://localhost:24020/

You need to set the Godaddy DNS API Key and Secret. Duplicate the file ```dns-config-sample.json``` and rename it to ```dns-config.json``` and modify it to add your Godaddy API Key and Secret.

You also need keycloak config. Duplicate the file ```keycloak-config-sample.json``` and rename it to ```keycloak-config.json``` and modify it to add your Godaddy API Key and Secret.

Each user is allowed to create a single deployment. You can set the max deployments allowed on the server in ```init_db.js```.

## File Structure

The file structure of this repo is same as any other NodeJS project. The routes are in ```routes/``` directory, the logics for the routes are in ```controls/``` directory, the client side files are in ```public/``` directory, and the EJS (HTML Structures) files are in ```views/``` directory.