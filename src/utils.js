import Papa from "papaparse";
import _ from "lodash";
import { usConfirmed, usDeaths } from "./constants";

const filter = (row) =>
  row.Province_State === "New Jersey" &&
  ["Hunterdon", "Somerset"].includes(row.Admin2);

const mapConfirmed = (row) => {
  const { Admin2, Province_State } = row;

  const result = Object.entries(row)
    .filter(([key, _val]) => !isNaN(key.charAt(0)))
    .map(([date, confirmed]) => ({ Admin2, Province_State, date, confirmed }));

  return result;
};

const mapDeaths = (row) => {
  const { Admin2, Province_State } = row;

  const result = Object.entries(row)
    .filter(([key, _val]) => !isNaN(key.charAt(0)))
    .map(([date, deaths]) => ({ Admin2, Province_State, date, deaths }));

  return result;
};

const getText = async (url) => {
  return await (await fetch(url)).text();
};

const getData = async () => {
  const usConfirmedData = await Papa.parse(await getText(usConfirmed), {
    header: true,
  });

  const usDeathsData = await Papa.parse(await getText(usDeaths), {
    header: true,
  });

  console.log(usDeathsData);

  const usConfirmedGrouped = _.groupBy(
    usConfirmedData.data.filter(filter).map(mapConfirmed).flat(),
    "date"
  );

  const usDeathsGrouped = _.groupBy(
    usDeathsData.data.filter(filter).map(mapDeaths).flat(),
    "date"
  );

  const result = Object.entries(usConfirmedGrouped).map(([date, data]) => ({
    date,
    hunterdonConfirmed: Number(
      data.find((row) => row.Admin2 === "Hunterdon").confirmed
    ),
    somersetConfirmed: Number(
      data.find((row) => row.Admin2 === "Somerset").confirmed
    ),
    hunterdonDeaths: Number(
      usDeathsGrouped[date].find((row) => row.Admin2 === "Hunterdon").deaths
    ),
    somersetDeaths: Number(
      usDeathsGrouped[date].find((row) => row.Admin2 === "Somerset").deaths
    ),
  }));

  return result;
};

export { getData };
