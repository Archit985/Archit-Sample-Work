# Ristorante-ConFusion
Hi there!
* This is a restaurant website named 'Ristorante ConFusion'.
* You maybe wondering why I named it _ConFusion_, it's because I was very _confused_ about what name should I give it :P
* Now coming to my site, it is made using React.js + HTML + CSS (Frontend), Express.js + Node.js (Backend) and MongoDB (Database).
* To start the site and see it working, follow these steps:<br/>
Step 1: Clone this repository in your desktop.<br/>
Step 2: Open command prompt/terminal and move to the cloned folder.<br/>
Step 3: Run the following commands to start the mongo server (_**Prerequisite**_ - You should have MongoDB already installed on your PC):
```batchfile
cd mongodb
```
```batchfile
mongod --dbpath=data --bind_ip 127.0.0.1
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Step 4: In a new terminal, again goto the cloned folder and run the following to start the Express server (_**Prerequisite**_ - You should have Node.js already installed on your PC):
```batchfile
cd conFusionServer
```
```batchfile
npm install
```
```batchfile
npm start
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Step 5: Again open a new terminal and inside the cloned folder run the following to start the React server:
```batchfile
cd conFusion-react
```
```batchfile
npm install
```
```batchfile
npm start
```
* Now a new browser window will open up with my site running on it. Have fun ;)
<br/>
PS: Login still requires some bug fixes, will update soon.
