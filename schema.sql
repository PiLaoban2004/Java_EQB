-- Drop tables if they exist to start fresh.
DROP TABLE IF EXISTS QuestionMastery;
DROP TABLE IF EXISTS WrongAnswers;
DROP TABLE IF EXISTS Users;

-- Create Users table
-- This table will store a unique identifier for each user.
CREATE TABLE Users (
    id TEXT PRIMARY KEY NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create WrongAnswers table
-- This table links users to the questions they answered incorrectly.
CREATE TABLE WrongAnswers (
    userId TEXT NOT NULL,
    questionId INTEGER NOT NULL,
    userAnswer TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (userId, questionId),
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Create QuestionMastery table
-- This table tracks the user's mastery over each question.
CREATE TABLE QuestionMastery (
    userId TEXT NOT NULL,
    questionId INTEGER NOT NULL,
    correctStreak INTEGER NOT NULL DEFAULT 0,
    lastAnsweredAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (userId, questionId),
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);
