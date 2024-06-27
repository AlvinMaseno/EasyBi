const express = require("express");
const connect = require("./connection");
const UserData = require("./Models/UserDataModel");
const cors = require("cors");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Verification = require("./Models/VerificationModel");
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");
const projectId = "adinfinite";
const { v4: uuidv4 } = require("uuid");
const keyFilename = "adinfinite-e53e2556555e.json";
const AdData = require("./Models/AdDataModel");
const ReportReviewData = require("./Models/ReviewReportModel");


require("dotenv").config;

const transporter = nodemailer.createTransport({
  service: "gmail", // or another email service
  auth: {
    user: "tom.ndemo.adinfinite@gmail.com",
    pass: "tbhwfuonpxrxrtha",
  },
});

const storage = new Storage({
  keyFilename,
  projectId,
});

const bucket = storage.bucket("adinfinite");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024,
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

app.get("/getUser/:id", async (req, res) => {
  try {
    const UserID = req.params.id;
    const result = await UserData.findOne({ _id: UserID });
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});


app.delete("/deleteAdReviews", async (req, res) => {
  const ID = req.query.id;
  try {
    const results = await ReportReviewData.Review.deleteMany({ AdID: ID });
    res.send(results);
  } catch (error) {
    console.error(error);
  }
});


app.delete("/deleteChats", async (req, res) => {
  const ID = req.query.id;
  try {
    const results = await Chat.deleteMany({
      $or: [{ InquireeID: ID }, { InquirerID: ID }],
    });
    res.send(results);
  } catch (error) {
    console.error(error);
  }
});

app.delete("/deleteUser", async (req, res) => {
  const ID = req.query.id;
  try {
    const results = await UserData.updateOne({ _id: ID }, { Enabled: false });
    res.send(results);
  } catch (error) {
    console.error(error);
  }
});


app.delete("/deleteUserImage", async (req, res) => {
  try {
    const url = req.body.url;
    const index = url.indexOf("/ProfilePic/");
    const imageName = url.substring(index + 1);
    await storage.bucket("adinfinite").file(imageName).delete();
    res.send({ message: "Image deleted successfully" });
  } catch (error) {
    console.error(error);
  }
});



app.delete("/deleteAdReports", async (req, res) => {
  const ID = req.query.id;
  try {
    const results = await ReportReviewData.Report.deleteMany({ AdID: ID });
    res.send(results);
  } catch (error) {
    console.error(error);
  }
});


app.delete("/deleteAdImages", express.json(), async (req, res) => {
  if (req.body.urls) {
    try {
      const urls = req.body.urls;
      const deletePromises = urls.map((imageUrl) => {
        const index = imageUrl.indexOf("/AdPic/");
        const imageName = imageUrl.substring(index + 1);

        // Then use the `imageName` variable in the `delete` method like this
        return storage.bucket("adinfinite").file(imageName).delete();
      });

      await Promise.all(deletePromises);

      res.send({ message: "Images deleted successfully" });
    } catch (error) {
      res.send({ message: "Internal server error" });
    }
  } else {
    res.send("No Image");
  }
});

app.get("/getPersonalAdData/:userID", async (req, res) => {
  const ID = req.params.userID;
  try {
    const results = await AdData.aggregate([
      { $match: { UserID: ID } },
      { $sort: { DateCreated: -1 } }, // Sort in ascending order based on DateCreated
    ]);
    res.send(results);
  } catch (error) {
    console.error(error);
    res.send(error);
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


app.post("/uploadAdImages", upload.array("images", 10), async (req, res) => {
  if (req.files) {
    try {
      const urls = [];
      const files = req.files;

      for (const file of files) {
        const filename = `AdPic/${uuidv4()}.jpg`;
        const blob = bucket.file(filename);
        const stream = blob.createWriteStream({
          resumable: false,
          contentType: file.mimetype,
        });

        stream.on("error", (err) => {
          console.error(err);
        });

        stream.on("finish", async () => {
          const url = `https://storage.googleapis.com/adinfinite/${filename}`;
          urls.push(url);

          if (urls.length === files.length) {
            res.send(urls);
          }
        });

        stream.end(file.buffer);
      }
    } catch (error) {
      console.error(error);
      res.send({ message: "Internal server error" });
    }
  } else {
    res.send("No Images");
  }
});

// Define a POST route for uploading data
app.post("/uploadAdData", (req, res) => {
  const data = req.body;
  //Change the Paid to false in case in the frontend it  was set to true
  if (data.Paid === true) {
    data.Paid = false;
  }
  if (data.CreatedOn == null) {
    data.DateCreated = new Date();
  }

  AdData.create(data)
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.put("/uploadAdData", (req, res) => {
  const data = req.body;

  AdData.updateOne({ _id: data.AdID }, data)
    .then(() => {
      res.send({ Proceed: true });
    })
    .catch((error) => {
      console.error(error);
      res.send({ Proceed: false });
    });
});


app.delete("/deleteAdImages", express.json(), async (req, res) => {
  if (req.body.urls) {
    try {
      const urls = req.body.urls;
      const deletePromises = urls.map((imageUrl) => {
        const index = imageUrl.indexOf("/AdPic/");
        const imageName = imageUrl.substring(index + 1);

        // Then use the `imageName` variable in the `delete` method like this
        return storage.bucket("adinfinite").file(imageName).delete();
      });

      await Promise.all(deletePromises);

      res.send({ message: "Images deleted successfully" });
    } catch (error) {
      res.send({ message: "Internal server error" });
    }
  } else {
    res.send("No Image");
  }
});

app.delete("/deleteAdReviews", async (req, res) => {
  const ID = req.query.id;
  try {
    const results = await ReportReviewData.Review.deleteMany({ AdID: ID });
    res.send(results);
  } catch (error) {
    console.error(error);
  }
});


app.delete("/deleteAdReviews", async (req, res) => {
  const ID = req.query.id;
  try {
    const results = await ReportReviewData.Review.deleteMany({ AdID: ID });
    res.send(results);
  } catch (error) {
    console.error(error);
  }
});

app.delete("/deleteAdReports", async (req, res) => {
  const ID = req.query.id;
  try {
    const results = await ReportReviewData.Report.deleteMany({ AdID: ID });
    res.send(results);
  } catch (error) {
    console.error(error);
  }
});

app.delete("/deleteAd", async (req, res) => {
  const ID = req.query.id;
  try {
    const results = await AdData.deleteOne({ _id: ID });
    res.send(results);
  } catch (error) {
    console.error(error);
  }
});


app.get("/HomeScreen/:number", async (req, res) => {
  const number = parseInt(req.params.number);
  try {
    const results = await AdData.aggregate([
      { $match: { Paid: true } },
      { $sample: { size: number } },
    ]);
    res.send(results);
  } catch (error) {
    res.send(error);
  }
});



// Define the API endpoint for searching items
app.post("/searchv2", async (req, res) => {
  //"Without Location"
  const searchValue = req.body.SearchValue;
  let limit = 10;
  const sourceCoordinates = {
    latitude: parseFloat(req.body.Coordinates?.latitude),
    longitude: parseFloat(req.body.Coordinates?.longitude),
  };
  console.log(req.body);
  if (req.body.number) {
    limit = req.body.number;
  }
console.log(sourceCoordinates)
  try {
    if (req.body.SearchValue.length > 3) {
      await UserSearchData.create(req.body);
    }
  } catch (error) {
    console.error(error);
  }

  try {
    // Find name matches
    const nameMatches = await AdData.find({
      Name: { $regex: searchValue, $options: "i" },
    }).limit(limit);
    if (sourceCoordinates) {
      nameMatches.forEach((item) => {
        if (item.Coordinates.Set) {
          const coords = item.Coordinates.coordinates;
          item.Distance = haversineDistance(sourceCoordinates, coords);
        } else {
          item.Distance = 9999999;
        }
      });

      nameMatches.sort((a, b) => {
        return a.Distance - b.Distance;
      });
    }

    // Extract the _id values of nameMatches
    const seenIdsFromNames = nameMatches.map((item) => item._id);

    let remainingLimit = limit - nameMatches.length;
    let keywordMatches = [];
    let locationMatches = [];

    // Check if there are still results needed
    if (remainingLimit > 0) {
      // Find keyword matches and exclude _id values seen in previous nameMatches
      keywordMatches = await AdData.find({
        Name: { $not: { $regex: searchValue, $options: "i" } },
        KeyWords: { $regex: searchValue, $options: "i" },
        _id: { $nin: seenIdsFromNames },
      }).limit(remainingLimit);
      if (sourceCoordinates) {
        keywordMatches.forEach((item) => {
          if (item.Coordinates.Set) {
            const coords = item.Coordinates.coordinates;
            item.Distance = haversineDistance(sourceCoordinates, coords);
          } else {
            item.Distance = 9999999;
          }
        });

        keywordMatches.sort((a, b) => {
          return a.Distance - b.Distance;
        });
      }

      // Extract the _id values of keywordMatches
      const seenIdsFromKeywords = keywordMatches.map((item) => item._id);

      remainingLimit -= keywordMatches.length;

      // Check if there are still results needed
      if (remainingLimit > 0) {
        // Find location matches and exclude _id values seen in previous nameMatches and keywordMatches
        locationMatches = await AdData.find({
          Name: { $not: { $regex: searchValue, $options: "i" } },
          KeyWords: { $not: { $regex: searchValue, $options: "i" } },
          Location: { $regex: searchValue, $options: "i" },
          _id: { $nin: [...seenIdsFromNames, ...seenIdsFromKeywords] },
        }).limit(remainingLimit);
      }
    }

    // Combine and sort the results (names first, then keywords, then locations)
    const allMatches = [...nameMatches, ...keywordMatches, ...locationMatches];

    res.send(allMatches);
  } catch (error) {
    console.error("Error searching items:", error);
    res.send({ error: "An error occurred while searching items" });
  }
});

function haversineDistance(coord1, coord2) {
  const R = 6371;
  const dLat = (coord2.latitude - coord1.latitude) * (Math.PI / 180);
  const dLon = (coord2.longitude - coord1.longitude) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.latitude * Math.PI) / 180) *
      Math.cos((coord2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}


// Define the API endpoint for searching items
app.post("/searchPage", async (req, res) => {
  //"Without Location"

  const searchValue = req.body.SearchValue;
  const page = req.body.Page;
  let limit = 10;
  console.log(req.body, "Next");
  try {
    if (req.body.SearchValue.length > 3) {
      await UserSearchData.create(req.body);
    }
  } catch (error) {
    console.error(error);
  }

  if (req.body.number) {
    limit = req.body.number;
  }

  try {
    // Find name matches
    const nameMatches = await AdData.find({
      Name: { $regex: searchValue, $options: "i" },
    })
      .limit(limit)
      .skip(page * 10);

    // Extract the _id values of nameMatches
    const seenIdsFromNames = nameMatches.map((item) => item._id);

    let remainingLimit = limit - nameMatches.length;
    let keywordMatches = [];
    let locationMatches = [];

    // Check if there are still results needed
    if (remainingLimit > 0) {
      // Find keyword matches and exclude _id values seen in previous nameMatches
      keywordMatches = await AdData.find({
        Name: { $not: { $regex: searchValue, $options: "i" } },
        KeyWords: { $regex: searchValue, $options: "i" },
        _id: { $nin: seenIdsFromNames },
      })
        .limit(remainingLimit)
        .skip(page * 10);

      // Extract the _id values of keywordMatches
      const seenIdsFromKeywords = keywordMatches.map((item) => item._id);

      remainingLimit -= keywordMatches.length;

      // Check if there are still results needed
      if (remainingLimit > 0) {
        // Find location matches and exclude _id values seen in previous nameMatches and keywordMatches
        locationMatches = await AdData.find({
          Name: { $not: { $regex: searchValue, $options: "i" } },
          KeyWords: { $not: { $regex: searchValue, $options: "i" } },
          Location: { $regex: searchValue, $options: "i" },
          _id: { $nin: [...seenIdsFromNames, ...seenIdsFromKeywords] },
        })
          .limit(remainingLimit)
          .skip(page * 10);
      }
    }

    // Combine and sort the results (names first, then keywords, then locations)
    const allMatches = [...nameMatches, ...keywordMatches, ...locationMatches];

    res.send(allMatches);
  } catch (error) {
    console.error("Error searching items:", error);
    res.send({ error: "An error occurred while searching items" });
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

app.put("/updateUserProfileChanges", async (req, res) => {
  const data = req.body;

  try {
    const emailInUse = async () => {
      const result = await UserData.findOne({
        Email: data.Email,
      });
      if (result) {
        return {
          message: `EMAIL ALREADY IN USE`,
          proceed: false,
        };
      }
    };

    const userNameInUse = async () => {
      const result = await UserData.findOne({
        UserName: data.UserName,
      });
      if (result) {
        return {
          message: `USERNAME ALREADY IN USE`,
          proceed: false,
        };
      }
    };

    const contactInUse = async () => {
      const result = await UserData.findOne({
        Contact: data.Contact,
      });
      if (result) {
        return {
          message: `CONTACT ALREADY IN USE`,
          proceed: false,
        };
      }
    };

    const emailCheck =
      data.Defaults.EmailDefault !== data.Email ? await emailInUse() : null;
    const userNameCheck =
      data.Defaults.UserNameDefault !== data.UserName
        ? await userNameInUse()
        : null;
    const contactCheck =
      data.Defaults.ContactDefault !== data.Contact
        ? await contactInUse()
        : null;

    if (emailCheck) {
      return res.send(emailCheck);
    }

    if (userNameCheck) {
      return res.send(userNameCheck);
    }

    if (contactCheck) {
      return res.send(contactCheck);
    }

    try {
      await AdData.updateMany(
        { UserID: data.userid },
        { UserName: data.UserName }
      );
    } catch (error) {
      res.send(error);
      return console.error(error);
    }

    try {
      await UserData.updateOne({ _id: data.userid }, data);
      return res.send({
        message: `UPDATE COMPLETE`,
        proceed: true,
      });
    } catch (error) {
      res.send("Update failed");
    }
  } catch (error) {
    res.send(error);
    return console.error(error);
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

app.post("/uploadUserImage", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    const filename = `ProfilePic/${uuidv4()}.jpg`;

    // Create a write stream to upload the file to the Google Cloud Storage bucket
    const blob = bucket.file(filename);
    const stream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    // Handle errors during the upload
    stream.on("error", (err) => {
      console.error(err);
      res.send({ error: "Internal server error" });
    });

    // Handle the completion of the upload
    stream.on("finish", () => {
      const url = `https://storage.googleapis.com/adinfinite/${filename}`;
      res.send({ imageUrl: url });
    });

    // Pipe the file data to the write stream
    stream.end(file.buffer);
  } catch (error) {
    console.error(error);
    res.send({ error: "Internal server error" });
  }
});


app.get("/checkExisting/:Name", async (req, res) => {
  const name = req.params.Name;
  try {
    const result = await AdData.findOne({ Name: new RegExp(`^${name}$`, "i") });
    if (result) {
      return res.send({ proceed: false, Message: "Business Name exists" });
    }
    res.send({ proceed: true, Message: "Business Name is free to use" });
  } catch (error) {
    console.error(error);
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