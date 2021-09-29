const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const axios = require("axios");
const config = require("config");

// @route GET api/restriction/:countryCode
// @desc Get all COVID-19 restrictions by country
// @access Public
router.get("/:countryCode", async (req, res) => {
  try {
    const uri = `${config.get(
      "covidtrackerURI"
    )}${req.params.countryCode.toUpperCase()}`;

    const headers = {
      "user-agent": "node.js",
      Authorization: `Bearer ${config.get("covidtrackertoken")}`,
      "Content-Type": "application/json",
    };

    const countryDataResponse = await axios.get(uri, { headers });

    const {
      data: {
        data: {
          area: { name: country },
        },
      },
    } = countryDataResponse;

    const {
      data: {
        data: {
          diseaseInfection: { level: infectionLevel },
        },
      },
    } = countryDataResponse;

    const {
      data: {
        data: {
          summary,
          diseaseRiskLevel,
          hotspots,
          dataSources,
          areaRestrictions,
          areaAccessRestriction,
          areaPolicy,
          areaVaccinated,
        },
      },
    } = countryDataResponse;

    const resultingResponse = {
      country,
      summary,
      diseaseRiskLevel,
      infectionLevel,
      hotspots,
      dataSources,
      areaRestrictions,
      areaAccessRestriction,
      areaPolicy,
      areaVaccinated,
    };

    return res.json(resultingResponse);
  } catch (err) {
    console.error(err.message);
    return res.status(404).send({ msg: "No data found" });
  }
});

module.exports = router;
