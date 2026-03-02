const Decision = require("../models/decisionModel");
 const calculateResult = (data) => {

  const { criteria, options, scores } = data;

  const totalWeight = criteria.reduce(
    (sum, c) => sum + parseFloat(c.weight),
    0
  );

  const normalizedWeights = criteria.map(c =>
    parseFloat(c.weight) / totalWeight
  );

  let finalScores = [];

  options.forEach((option, optionIndex) => {

    let totalScore = 0;

    criteria.forEach((criterion, criterionIndex) => {

      const values = options.map((_, i) =>
        parseFloat(scores[i][criterionIndex])
      );

      const min = Math.min(...values);
      const max = Math.max(...values);

      const value = parseFloat(scores[optionIndex][criterionIndex]);

      let normalizedValue = 0;

      if (max === min) {
        normalizedValue = 1;
      } else if (criterion.type === "benefit") {
        normalizedValue = (value - min) / (max - min);
      } else {
        normalizedValue = (max - value) / (max - min);
      }

      totalScore += normalizedValue * normalizedWeights[criterionIndex];
    });

    finalScores.push({
      name: option.name,
      score: Number(totalScore.toFixed(4)),
      index: optionIndex
    });
  });

  finalScores.sort((a, b) => b.score - a.score);

  return finalScores;
};
exports.createDecision = async (req, res) => {
    const calculateResult = (data) => {

  const { criteria, options, scores } = data;

  const totalWeight = criteria.reduce(
    (sum, c) => sum + parseFloat(c.weight),
    0
  );

  const normalizedWeights = criteria.map(c =>
    parseFloat(c.weight) / totalWeight
  );

  let finalScores = [];

  options.forEach((option, optionIndex) => {

    let totalScore = 0;

    criteria.forEach((criterion, criterionIndex) => {

      const values = options.map((_, i) =>
        parseFloat(scores[i][criterionIndex])
      );

      const min = Math.min(...values);
      const max = Math.max(...values);

      const value = parseFloat(scores[optionIndex][criterionIndex]);

      let normalizedValue = 0;

      if (max === min) {
        normalizedValue = 1;
      } else if (criterion.type === "benefit") {
        normalizedValue = (value - min) / (max - min);
      } else {
        normalizedValue = (max - value) / (max - min);
      }

      totalScore += normalizedValue * normalizedWeights[criterionIndex];
    });

    finalScores.push({
      name: option.name,
      score: Number(totalScore.toFixed(4)),
      index: optionIndex
    });
  });

  finalScores.sort((a, b) => b.score - a.score);

  return finalScores;
};


    console.log("Inside createDecision");

    console.log(req.body)
    const { item,criteria,options,scores} =req.body
    const userMail =req.payload
    console.log(userMail)
    try{
        const results = calculateResult({ criteria, options, scores });

        const winner = results[0]?.name;

        const explanation = `${winner} ranked highest because it achieved the best weighted score based on your criteria.`;
        const newDecision=await Decision({
        item,
        criteria,
        options,
        scores,
        userMail,
        finalScores: results,
        ranking: results,
        winner,
        explanation
    });
    await newDecision.save()
    res.status(200).json("Decision data added successfully...")
    }
    catch(err)
    {
        res.status(500).json("Error"+err)
    }

    // res.send("Request Received...")
};
exports.getLatestDecision = async (req, res) => {
    const userMail = req.payload;

    try {
        const decision = await Decision.findOne({ userMail })
            .sort({ createdAt: -1 });

        res.status(200).json(decision);
    } catch (err) {
        res.status(500).json("Error: " + err);
    }
};
exports.updateDecision = async (req, res) => {
  try {
    const results = calculateResult(req.body);

    const winner = results[0]?.name;

    const explanation = `${winner} ranked highest because it achieved the best weighted score based on your criteria.`;
    const userMail=req.payload
    const updatedDecision = await Decision.findOneAndUpdate(
  { _id: req.params.id, userMail },
  {
    ...req.body,
    finalScores: results,
    ranking: results,
    winner,
    explanation
  },
  { new: true }
);

    res.status(200).json(updatedDecision);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
};
exports.getUserDecisions = async (req, res) => {
  try {
    const userMail = req.payload; // coming from JWT middleware

    const decisions = await Decision.find({ userMail })
      .sort({ createdAt: -1 });

    res.status(200).json(decisions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching decisions" });
  }
};