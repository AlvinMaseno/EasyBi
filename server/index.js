const express = require("express");
const connect = require("./connection");
const UserData = require("./Models/UserDataModel");
const cors = require("cors");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Verification = require("./Models/VerificationModel");

require("dotenv").config;

const transporter = nodemailer.createTransport({
  service: "gmail", // or another email service
  auth: {
    user: "tom.ndemo.adinfinite@gmail.com",
    pass: "tbhwfuonpxrxrtha",
  },
});

connect();

// Create a new Express app
const app = express();
app.set("trust proxy", 1);
app.use(express.json());

app.use((req, res, next) => {
  cors()(req, res, (err) => {
    if (err) {
      console.error("CORS Error:", err.message);
      return res.status(500).json({ error: "CORS issue" });
    } else {
    }
    next();
  });
});

app.post("/createUser", async (req, res) => {
  const data = req.body.verification;
  try {
    await Verification.deleteOne({
      _id: req.body.VerificationID,
    });
    console.log("Verification code deleted");
  } catch (error) {
    console.error(error);
  }
  try {
    const saltRounds = 12; // increase the number of salt rounds
    const hashedPassword = await bcrypt.hash(data.Password, saltRounds);

    delete data.Password;
    data.HashedPassword = hashedPassword;
    data.Enabled = true;

    const user = await UserData.create(data);
    return res.send({
      data: {
        UserID: user._id.toString(),
        Name: user.Name,
        UserName: user.UserName,
        Email: user.Email,
      },
      message: `USER ${user.UserName} CREATED SUCCESFULLY`,
      proceed: true,
    });
  } catch (error) {
    console.error(error);
    return res.send("ERROR CREATING ACCOUNT");
  }
});

app.post("/verify", async (req, res) => {
  const data = req.body;
  try {
    const emailInUse = await UserData.findOne({
      Email: data.Email,
    });
    const userNameInUse = await UserData.findOne({
      UserName: data.UserName,
    });
    const contactInUse = await UserData.findOne({
      Contact: data.Contact,
    });
    if (emailInUse) {
      return res.send({
        message: `EMAIL ALREADY IN USE`,
        proceed: false,
      });
    }
    if (userNameInUse) {
      return res.send({
        message: `USERNAME ALREADY IN USE`,
        proceed: false,
      });
    }
    if (contactInUse) {
      return res.send({
        message: `CONTACT ALREADY IN USE`,
        proceed: false,
      });
    }
    // Generate a random 5-digit verification code
    function generateVerificationCode() {
      return Math.floor(10000 + Math.random() * 90000);
    }
    const code = generateVerificationCode();
    const verificationID = generateVerificationCode();
    const mailOptions = {
      from: '"EasyBi" <tom.ndemo.adinfinite@gmail.com>',
      to: data.Email,
      subject: "Your verification code",
      text: `Your OTP for EasyBi is ${code}. Best Regards, EasyBi`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        res.send({
          message: error.message,
          proceed: false,
        });
        console.error("ERROR SENDING VERIFICATION CODE:", error.message);
        console.error("ERROR SENDING VERIFICATION CODE");
      } else {
        var verificationData = { VerificationID: verificationID, Code: code };
        await Verification.create(verificationData);
        res.send({
          proceed: true,
          message: "Verification code sent",
          verificationID: verificationID,
        });
      }
    });
  } catch (error) {
    return res.send("ERROR CREATING ACCOUNT");
  }
});

app.get("/verifyCode/:verificationID/:trialCode", async (req, res) => {
  const { verificationID, trialCode } = req.params;
  try {
    const result = await Verification.findOne({
      VerificationID: parseInt(verificationID),
    });
    if (result.Code == trialCode) {
      res.send({
        proceed: true,
      });
      await Verification.deleteOne({ VerificationID: verificationID });
    } else {
      res.send({
        proceed: false,
      });
    }
  } catch (error) {
    console.error(error);
  }
});

app.post("/SignIn", async (req, res) => {
  const { Email, Password } = req.body;
  try {
    const user = await UserData.findOne({
      Email: Email,
      Enabled: true,
    });
    if (!user) {
      return res.send({
        message: `USER NOT FOUND`,
        proceed: false,
      });
    }

    const match = await bcrypt.compare(Password, user.HashedPassword);
    if (!match) {
      return res.send({
        message: `INCORRECT PASSWORD`,
        proceed: false,
      });
    }

    return res.send({
      data: {
        UserID: user._id.toString(),
        Name: user.Name,
        UserName: user.UserName,
        Email: user.Email,
        UserImageUrl: user.UserImageUrl,
      },
      message: `USER ${user.UserName} SIGNED IN SUCCESSFULLY`,
      proceed: true,
    });
  } catch (error) {
    return res.send("ERROR SIGNING IN");
  }
});

app.get("/test", (req, res) => {
  try {
    res.send("Worked");
  } catch (error) {
    console.error(err.message);
    res.status("test", error);
  }
});

app.get("/resetPassword/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const user = await UserData.findOne({
      Email: email,
      Enabled: true,
    });
    if (!user) {
      return res.send({
        message: `EMAIL NOT FOUND`,
        proceed: false,
      });
    }
    // Generate a random 5-digit verification code
    function generateVerificationCode() {
      return Math.floor(10000 + Math.random() * 90000);
    }
    const code = generateVerificationCode();
    const verificationID = generateVerificationCode();
    console.log(email);
    const mailOptions = {
      from: '"EasyBi" <tom.ndemo.adinfinite@gmail.com>',
      to: email,
      subject: "Your verification code",
      text: `Your OTP for EasyBi is ${code}. Best Regards, EasyBi`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        res.send({
          message: error.message,
          proceed: false,
        });
        console.error("ERROR SENDING VERIFICATION CODE:", error.message);
        console.error("ERROR SENDING VERIFICATION CODE");
      } else {
        var verificationData = { VerificationID: verificationID, Code: code };
        await Verification.create(verificationData);
        console.log(true);
        res.send({
          proceed: true,
          message: "Verification code sent",
          verificationID: verificationID,
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
});

app.put("/resetPassword", async (req, res) => {
  const saltRounds = 12; // increase the number of salt rounds
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

  try {
    const result = await UserData.updateOne(
      { Email: req.body.email },
      { HashedPassword: hashedPassword }
    );
    console.log(result)

    const user = await UserData.findOne({
      Email:  req.body.email,
      Enabled: true,
    });
    res.send({ status: "OK", user: user });
  } catch (error) {
    res.send({ status: "ERROR", message:"failed",error:error  });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("App listening on port 3000");
});
