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
const AdSubscriptions = require("./Models/AdSubscriptionsModel");
const Chat = require("./Models/Chat");
const { default: axios } = require("axios");
const secretKey = process.env.STK_SECRETE_KEY

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

app.post("/Review", async (req, res) => {
  const data = req.body;
  const ReviewData = ReportReviewData.Review;
  const newReviewData = new ReviewData(data);
  newReviewData
    .save()
    .then(() => {
      res.send("Review sent");
    })
    .catch((err) => {
      res.send("Review failed to send");
    });
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

app.get("/getAdData/:ID", async (req, res) => {
  const ID = req.params.ID;
  try {
    const result = await AdData.findOne({ _id: ID });
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send(error);
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

app.delete("/deleteAd", async (req, res) => {
  const ID = req.query.id;
  try {
    const results = await AdData.deleteOne({ _id: ID });
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

app.post("/Report", async (req, res) => {
  const data = req.body;
  const ReportData = ReportReviewData.Report;
  const newReportData = new ReportData(data);
  newReportData
    .save()
    .then(() => {
      res.send("Report sent");
    })
    .catch((error) => {
      console.error("Report failed to send");
    });
});

app.delete("/deleteReview", async (req, res) => {
  const ID = req.query.id;
  try {
    const results = await ReportReviewData.Review.deleteOne({ _id: ID });
    res.send(results);
  } catch (error) {}
});

app.get("/Review/:adId", async (req, res) => {
  const ID = req.params.adId; // use "adId" instead of "adID"
  try {
    const results = await ReportReviewData.Review.aggregate([
      { $match: { AdID: ID } },
      { $sample: { size: 5 } },
    ]);
    res.send(results);
  } catch (error) {
    res.send(error);
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
app.get("/search/:searchValue/:number", async (req, res) => {
  //"Without Location"

  const searchValue = req.params.searchValue;
  let limit = 10;

  if (req.params.number) {
    limit = req.params.number;
  }

  try {
    // Find name matches
    const nameMatches = await AdData.find({
      Name: { $regex: searchValue, $options: "i" },
    }).limit(limit);

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

    const emailCheck =
      data.Defaults.EmailDefault !== data.Email ? await emailInUse() : null;
    const userNameCheck =
      data.Defaults.UserNameDefault !== data.UserName
        ? await userNameInUse()
        : null;

    if (emailCheck) {
      return res.send(emailCheck);
    }

    if (userNameCheck) {
      return res.send(userNameCheck);
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
    console.log(result);

    const user = await UserData.findOne({
      Email: req.body.email,
      Enabled: true,
    });
    res.send({ status: "OK", user: user });
  } catch (error) {
    res.send({ status: "ERROR", message: "failed", error: error });
  }
});

app.get("/getMessages/:userID/:AdIDs/:number", async (req, res) => {
  try {
    const userID = req.params.userID;
    const AdIDs = req.params.AdIDs.split(","); // Split the AdIDs at the comma to create an array
    const number = parseInt(req.params.number);

    const copyOfAdIDs = [...AdIDs, userID];

    const resultsArr = [];
    await Promise.all(
      copyOfAdIDs.map(async (item) => {
        const results = await Chat.aggregate([
          {
            $match: {
              $or: [{ InquirerID: item }, { InquireeID: item }],
            },
          },
          {
            $sort: {
              LastModified: -1, // Sort chats in descending order of LastModified
            },
          },
          {
            $limit: number, // Limit the result to 10 chats
          },
          {
            $project: {
              Messages: 0, // Exclude the Messages field from the output
            },
          },
        ]);
        if (results.length !== 0) {
          resultsArr.push(results);
        }
      })
    );
    res.send(resultsArr);
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.send("An error occurred while retrieving messages.");
  }
});

app.get("/getChat/:inquirerID/:inquireeID/:number", async (req, res) => {
  const inquirerID = req.params.inquirerID;
  const inquireeID = req.params.inquireeID;
  const number = parseInt(req.params.number) * -1; //convert limit to negative value

  try {
    const results = await Chat.aggregate([
      {
        $match: {
          $or: [
            { InquirerID: inquirerID, InquireeID: inquireeID },
            { InquirerID: inquireeID, InquireeID: inquirerID },
          ],
        },
      },
      {
        $unwind: "$Messages",
      },
      {
        $sort: {
          "Messages.dateSent": -1, // Sort messages in descending order of dateSent
        },
      },
      {
        $group: {
          _id: "$_id",
          Messages: { $push: "$Messages" }, // Collect all the messages
        },
      },
      {
        $project: {
          Messages: { $slice: ["$Messages", number] }, // Limit to 10 messages
        },
      },
    ]);
    res.send(results[0]);
    // Assuming there's only one document in the results array
  } catch (error) {
    res.send(error);
    console.error(error);
  }
});

// Route handler to create a new chat
app.post("/createChat", async (req, res) => {
  const chatData = req.body;
  try {
    const newChat = new Chat({
      Messages: [
        {
          Message: chatData.message,
          DateSent: chatData.dateSent,
          SenderID: chatData.senderID,
        },
      ],
      LastModified: chatData.dateSent,
      InquirerID: chatData.inquirer,
      InquireeID: chatData.inquiree,
    });

    const savedChat = await newChat.save();
    res.send(savedChat);
  } catch (error) {
    console.error(error);
    res.send({ error: "Internal server error" });
  }
});

// Route handler to update an existing chat
app.put("/updateChats", async (req, res) => {
  const chatData = req.body;
  try {
    const chat = await Chat.findById(chatData.chatID);

    if (!chat) {
      return res.send({ error: "Chat not found" });
    }

    chat.Messages.push({
      Message: chatData.message,
      DateSent: chatData.dateSent,
      SenderID: chatData.senderID,
    });

    chat.LastModified = chatData.dateSent; // Update LastModified field

    const updatedChat = await chat.save();
    res.send(updatedChat);
  } catch (error) {
    console.error(error);
    res.send({ error: "Internal server error" });
  }
});

app.post("/stk", async (req, res) => {
  const details=req.body

  const secretKey = process.env.STK_SECRETE_KEY;
  let reference;

  const metadata = {
    PhoneNumber: details.PhoneNumber,
    Amount: details.Amount,
    AdID: details.AdID,
    UserName: details.UserName,
    AdName:details.AdName,
    UserID: details.UserID
  };

  const data = {
    amount: 200,
    email: "customer@email.com",
    currency: "KES",
    mobile_money: {
      phone: `+254${details.PhoneNumber}`,
      provider: "mpesa",
    },
    metadata: metadata,
  };

  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${secretKey}`,
    },
  };

  axios
    .post("https://api.paystack.co/charge", data, config)
    .then((response) => {
      reference = response.data.data.reference; // Corrected path to reference
      console.log(response.data)
      setTimeout(verifyTransaction, 15000); // Delaying the verification to ensure transaction processing
    })
    .catch((error) => {
      if (error.response) {
        console.error("Error Response:", error.response.data);
      } else {
        console.error("Error Message:", error.message);
      }
    });

  async function verifyTransaction() {
    console.log("verifying transaction");
    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );

      if (response.data.status) {
        const transactionData = response.data;
        const resultObject = {
          Amount: transactionData.data.amount,
          PhoneNumber: transactionData.data.metadata.PhoneNumber,
          MpesaReceiptNumber: transactionData.data.receipt_number,
          TransactionDate: transactionData.data.transaction_date,
          AdID: transactionData.data.metadata.AdID,
          AdName: transactionData.data.metadata.AdName,
          UserID: transactionData.data.metadata.UserID,
          UserName: transactionData.data.metadata.UserName,
        };

        let plan, expiryDate;

        if (resultObject.Amount === 300) {
          plan = "Monthly";
          expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        } else if (resultObject.Amount === 200) {
          plan = "Weekly";
          expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        }

        const subsData = {
          AdID: resultObject.AdID,
          UserID: resultObject.UserID,
          UserName: resultObject.UserName,
          AdName: resultObject.AdName,
          TransactionDate: resultObject.TransactionDate,
          MpesaReceiptNumber: resultObject.MpesaReceiptNumber,
          PhoneNumber: resultObject.PhoneNumber,
          Amount: resultObject.Amount,
          Plan: plan,
        };

        await AdSubscriptions.create(subsData);

        const updatedAdData = {
          Paid: true,
          Plan: plan,
          ExpiryDate: expiryDate,
        };


        await AdData.updateOne({ _id: resultObject.AdID }, updatedAdData);
        res.send({ Proceed: true });
      }else{
        console.log(response.data)
      }
    } catch (error) {
      console.error(error);
    }
  }
});

const checkSubscriptions = async () => {
  const currentDate = new Date();
  return;
  try {
    const result = await AdData.updateMany(
      {
        ExpiryDate: { $lt: currentDate }, // Use $lt instead of { lt: currentDate }
        Paid: true,
      },
      {
        $set: { Plan: "", Paid: false, ExpiryDate: null },
      }
    );
  } catch (error) {
    console.error("Error in subscription check:", error);
  }
};

// Call the function immediately
checkSubscriptions();

// Schedule the function to run every 24 hours
const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

setInterval(checkSubscriptions, twentyFourHours);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("App listening on port 3000");
});
