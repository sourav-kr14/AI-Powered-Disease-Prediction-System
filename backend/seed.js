require("dotenv").config();
const dns = require("dns");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Prediction = require("./models/Prediction");

// Configure public DNS resolvers to handle SRV query resolution on Windows
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch (e) {
  console.warn("DNS server override notice:", e.message);
}

async function seed() {
  const uri = process.env.MONGO_URI || "mongodb+srv://souravkr93:Singapore145@cluster0.8bllx.mongodb.net/symptoscan?retryWrites=true&w=majority";

  console.log("Connecting to MongoDB at:", uri.replace(/:([^:@]+)@/, ":****@"));
  
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log("✅ Successfully connected to MongoDB!");

    // Hash password for default users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Password@123", salt);

    const testUsers = [
      {
        name: "Dr. Alex Taylor",
        email: "alex.taylor@symptoscan.org",
        password: hashedPassword,
        avatar: "",
        profile: {
          age: 34,
          gender: "male",
          weight: 74,
          height: 180,
          activityLevel: "active",
          goal: "maintain",
          bloodGroup: "O+",
          allergies: ["Penicillin"],
        },
        vitals: {
          waterIntakeGlasses: 6,
          waterGoalGlasses: 8,
          checklist: {
            vitamins: true,
            workout: true,
            hydration: true,
            sleep: true,
          },
        },
      },
      {
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        password: hashedPassword,
        avatar: "",
        profile: {
          age: 28,
          gender: "female",
          weight: 62,
          height: 165,
          activityLevel: "moderate",
          goal: "loss",
          bloodGroup: "A+",
          allergies: ["Pollen", "Dust"],
        },
        vitals: {
          waterIntakeGlasses: 5,
          waterGoalGlasses: 8,
          checklist: {
            vitamins: true,
            workout: false,
            hydration: true,
            sleep: false,
          },
        },
      },
      {
        name: "Demo User",
        email: "demo@symptoscan.com",
        password: hashedPassword,
        avatar: "",
        profile: {
          age: 25,
          gender: "male",
          weight: 70,
          height: 175,
          activityLevel: "moderate",
          goal: "maintain",
          bloodGroup: "B+",
          allergies: [],
        },
        vitals: {
          waterIntakeGlasses: 4,
          waterGoalGlasses: 8,
          checklist: {
            vitamins: true,
            workout: false,
            hydration: false,
            sleep: true,
          },
        },
      },
    ];

    for (const userData of testUsers) {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        // Update user
        await User.updateOne({ email: userData.email }, { $set: userData });
        console.log(`🔄 Updated existing user: ${userData.email}`);
      } else {
        await User.create(userData);
        console.log(`✨ Created new user: ${userData.email}`);
      }
    }

    // Also seed sample prediction history for Dr. Alex Taylor
    const alex = await User.findOne({ email: "alex.taylor@symptoscan.org" });
    if (alex) {
      const samplePredictions = [
        {
          userId: alex._id,
          userName: alex.name,
          symptoms: ["itching", "skin_rash", "nodal_skin_eruptions"],
          predictedDisease: "Fungal infection",
          top3Predictions: [
            { disease: "Fungal infection", confidence: 0.94 },
            { disease: "Dermatitis", confidence: 0.72 },
            { disease: "Allergy", confidence: 0.45 },
          ],
          precautions: {
            "Fungal infection": [
              "Bath twice daily",
              "Use clean and dry towels",
              "Avoid sharing clothes",
              "Keep the affected area dry",
            ],
          },
        },
        {
          userId: alex._id,
          userName: alex.name,
          symptoms: ["continuous_sneezing", "chills", "fatigue", "cough", "high_fever"],
          predictedDisease: "Common Cold",
          top3Predictions: [
            { disease: "Common Cold", confidence: 0.89 },
            { disease: "Allergic Rhinitis", confidence: 0.65 },
            { disease: "Viral Fever", confidence: 0.51 },
          ],
          precautions: {
            "Common Cold": [
              "Drink warm liquids",
              "Rest adequately",
              "Take steam inhalation",
              "Avoid cold foods and drinks",
            ],
          },
        },
      ];

      for (const pred of samplePredictions) {
        const existingPred = await Prediction.findOne({
          userId: alex._id,
          predictedDisease: pred.predictedDisease,
        });
        if (!existingPred) {
          await Prediction.create(pred);
          console.log(`🩺 Seeded sample prediction: ${pred.predictedDisease}`);
        }
      }
    }

    console.log("\n🎉 Database seeded successfully into MongoDB Atlas!");
    console.log("==================================================");
    console.log("Credentials ready to login and test:");
    console.log("1) Dr. Alex Taylor (Practitioner account):");
    console.log("   Email: alex.taylor@symptoscan.org");
    console.log("   Password: Password@123");
    console.log("");
    console.log("2) Sarah Johnson (Patient account):");
    console.log("   Email: sarah.johnson@example.com");
    console.log("   Password: Password@123");
    console.log("");
    console.log("3) Demo Member:");
    console.log("   Email: demo@symptoscan.com");
    console.log("   Password: Password@123");
    console.log("==================================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seed();
