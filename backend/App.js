const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 7799;
const jwt = require("jsonwebtoken");
const jwtSecret = "asd889asdas5656asdas887";
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const cors = require("cors");
app.use(cors());
const db = "mongodb://localhost:27017/pizzastore";

const nodemailer = require("nodemailer");
const { getMaxListeners } = require("process");

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    service: "gmail",
    port: 535,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "saurabhdubey788@gmail.com", // generated ethereal user
      pass: "Saurabh7841058258", // generated ethereal password
    },
  });
  let mailerdetails = {
    from: "saurabhdubey788@gmail.com", // sender address
    to: "saurabhdubey788@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello Dear Customer, Your Order Placed ✔!!!!", // plain text body
    /*  html: "<b>Hello world?</b>", // html body */
  };
  // send mail with defined transport object
  transporter.sendMail(mailerdetails, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log("Success");
      console.log("sender Mail :", mailerdetails.from);
      console.log("receiever Mail :", mailerdetails.to);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    }
  });
}

//jwt middle function
function autenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);
  if (token == null) {
    res.json({ err: 1, msg: "Token not match" });
  } else {
    jwt.verify(token, jwtSecret, (err, data) => {
      if (err) {
        res.json({ err: 1, msg: "Token incorrect" });
      } else {
        console.log("Match");
        next();
      }
    });
  }
}
const connectDB = async () => {
  try {
    await mongoose.connect(db, { useNewUrlParser: true });
    console.log("MongoDb Connected");
  } catch (err) {
    console.log(err.message);
  }
};
connectDB();
//end
const pizzaModel = require("./db/pizzaSchema");
const userModel = require("./db/userSchema");
const orderModel = require("./db/orderSchema");
const cartModel = require("./db/cartSchema");

app.get("/fetchpizza", (req, res) => {
  pizzaModel.find({}, (err, data) => {
    if (err) throw err;
    res.json({ postData: data });
  });
});

app.post("/adduser", function (req, res) {
  const formDetails = {
    uname: req.body.name,
    uemail: req.body.email,
    uage: req.body.age,
    upassword: req.body.password,
  };
  console.log(formDetails);
  //insert data
  let ins = new userModel({
    uname: req.body.name,
    uemail: req.body.email,
    uage: req.body.age,
    upassword: req.body.password,
  });
  ins.save((err) => {
    if (err) throw err;
  });
});

app.get("/getuser", (req, res) => {
  userModel.find({}, (err, data) => {
    if (err) throw err;
    res.json({ userData: data });
  });
});

app.post("/addcart", (req, res) => {
  let pid = req.body.id;
  let pname1 = req.body.name;
  let price1 = req.body.price;
  cartModel.find({ _id: pid }, (err, data) => {
    if (err) throw err;
    if (data) {
      cartModel.updateOne(
        { _id: pid },
        { $set: { $inc: { quantity: 1 } } },
        (err) => {
          console.log("UPDATED");
          if (err) throw err;
        }
      );
    } else {
      let ins = new cartModel({ pname: pname1, price: price1, quantity: 1 });
      ins.save((err) => {
        if (err) throw err;
        console.log("ADDED");
      });
    }
  });
});

app.get("/getcart", (req, res) => {
  cartModel.find({}, (err, data) => {
    if (err) throw err;
    res.json({ cartData: data });
  });
});

app.post("/addorder", (req, res) => {
  let pname1 = req.body.name;
  let price1 = req.body.price;
  let quantity1 = req.body.quantity;
  let uid1 = req.body.userid;

  let ins = new orderModel({
    pname: pname1,
    price: price1,
    quantity: quantity1,
    userid: uid1,
  });
  ins.save((err) => {
    if (err) throw err;
  });
});

app.get("/getorder", (req, res) => {
  orderModel.find({}, (err, data) => {
    if (err) throw err;
    res.json({ orderData: data });
  });
});
app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  userModel.findOne({ uemail: email, upassword: password }, (err, data) => {
    if (err) {
      res.json({ err: 1, msg: "Email or password is not correct" });
    } else if (data == null) {
      res.json({ err: 1, msg: "Email or password is not correct" });
    } else {
      let payload = {
        uid: email,
      };
      const token = jwt.sign(payload, jwtSecret, { expiresIn: 120000 });
      res.json({ err: 0, msg: "Login Success", token: token, user: data });
    }
  });
});
app.post("/addmail", main, (req, res) => {});

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Work on ${PORT}`);
});
