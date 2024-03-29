import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { useLocalStorageValue } from "@react-hookz/web/esm"; // esm
import { queryOptions } from "./constants";
import { getData, processData } from "./utils";
import Table from "./Table";
import Chart from "./Chart";
import CountySelector from "./CountySelector";

const JHU_REPO = "https://github.com/CSSEGISandData/COVID-19";

function App() {
  const {
    isLoading,
    isError,
    data: rawData,
  } = useQuery("usData", () => getData(), queryOptions);

  const [UIDs] = useLocalStorageValue("UIDs", ["84034019"], {
    storeDefaultValue: true,
  });

  const data = useMemo(() => {
    return rawData && UIDs ? processData(rawData, UIDs) : [];
  }, [rawData, UIDs]);

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="w-full p-4 text-center bg-neutral-700 text-neutral-200">
        On March 10, 2023, the Johns Hopkins Coronavirus Resource Center ceased
        its collecting and reporting of global COVID-19 data. For more info, see{" "}
        <a
          className="underline"
          href="https://github.com/CSSEGISandData/COVID-19"
        >
          here
        </a>
        .
      </div>
      <div className="w-full p-4 text-center bg-neutral-800 text-neutral-200">
        If you have issues loading this site in chrome, try firefox.
      </div>

      {isError && <div>Error...</div>}

      {isLoading && <div>Loading...</div>}

      {Object.keys(rawData?.counties || {})?.includes("84034019") &&
        Object.entries(data).length !== 0 && (
          <div className="max-w-screen-xl w-full m-auto flex flex-col gap-4 p-4">
            <Chart data={data} counties={rawData.counties} UIDs={UIDs} />
            <CountySelector counties={rawData.counties} />
            <Table data={data} counties={rawData.counties} UIDs={UIDs} />
          </div>
        )}
      <div className="flex-grow"></div>
      <footer className="p-1">
        <a className="text-blue-500 hover:underline" href={JHU_REPO}>
          JHU CSSE COVID-19 Data
        </a>
      </footer>
    </div>
  );
}

export default App;
