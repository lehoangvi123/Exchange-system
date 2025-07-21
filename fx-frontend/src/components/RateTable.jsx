import React, { useState } from 'react';

const currencyCountries = {
  AED: "United Arab Emirates", AFN: "Afghanistan", ALL: "Albania", AMD: "Armenia",
  ANG: "Netherlands Antilles", AOA: "Angola", ARS: "Argentina", AUD: "Australia",
  AWG: "Aruba", AZN: "Azerbaijan", BAM: "Bosnia and Herzegovina", BBD: "Barbados",
  BDT: "Bangladesh", BGN: "Bulgaria", BHD: "Bahrain", BIF: "Burundi", BMD: "Bermuda",
  BND: "Brunei", BOB: "Bolivia", BRL: "Brazil", BSD: "Bahamas", BTN: "Bhutan",
  BWP: "Botswana", BYN: "Belarus", BZD: "Belize", CAD: "Canada", CDF: "Congo",
  CHF: "Switzerland", CLP: "Chile", CNY: "China", COP: "Colombia", CRC: "Costa Rica",
  CUP: "Cuba", CVE: "Cabo Verde", CZK: "Czech Republic", DJF: "Djibouti",
  DKK: "Denmark", DOP: "Dominican Republic", DZD: "Algeria", EGP: "Egypt",
  ERN: "Eritrea", ETB: "Ethiopia", EUR: "European Union", FJD: "Fiji",
  FKP: "Falkland Islands", GBP: "United Kingdom", GEL: "Georgia", GHS: "Ghana",
  GIP: "Gibraltar", GMD: "Gambia", GNF: "Guinea", GTQ: "Guatemala", GYD: "Guyana",
  HKD: "Hong Kong", HNL: "Honduras", HRK: "Croatia", HTG: "Haiti", HUF: "Hungary",
  IDR: "Indonesia", ILS: "Israel", INR: "India", IQD: "Iraq", IRR: "Iran", ISK: "Iceland",
  JMD: "Jamaica", JOD: "Jordan", JPY: "Japan", KES: "Kenya", KGS: "Kyrgyzstan",
  KHR: "Cambodia", KMF: "Comoros", KRW: "South Korea", KWD: "Kuwait", KYD: "Cayman Islands",
  KZT: "Kazakhstan", LAK: "Laos", LBP: "Lebanon", LKR: "Sri Lanka", LRD: "Liberia",
  LSL: "Lesotho", LYD: "Libya", MAD: "Morocco", MDL: "Moldova", MGA: "Madagascar",
  MKD: "North Macedonia", MMK: "Myanmar", MNT: "Mongolia", MOP: "Macau", MUR: "Mauritius",
  MVR: "Maldives", MWK: "Malawi", MXN: "Mexico", MYR: "Malaysia", MZN: "Mozambique",
  NAD: "Namibia", NGN: "Nigeria", NIO: "Nicaragua", NOK: "Norway", NPR: "Nepal",
  NZD: "New Zealand", OMR: "Oman", PAB: "Panama", PEN: "Peru", PGK: "Papua New Guinea",
  PHP: "Philippines", PKR: "Pakistan", PLN: "Poland", PYG: "Paraguay", QAR: "Qatar",
  RON: "Romania", RSD: "Serbia", RUB: "Russia", RWF: "Rwanda", SAR: "Saudi Arabia",
  SBD: "Solomon Islands", SCR: "Seychelles", SDG: "Sudan", SEK: "Sweden",
  SGD: "Singapore", SHP: "Saint Helena", SLE: "Sierra Leone", SLL: "Sierra Leone",
  SOS: "Somalia", SRD: "Suriname", SSP: "South Sudan", STD: "São Tomé and Príncipe",
  SYP: "Syria", SZL: "Eswatini", THB: "Thailand", TJS: "Tajikistan", TMT: "Turkmenistan",
  TND: "Tunisia", TOP: "Tonga", TRY: "Turkey", TTD: "Trinidad and Tobago", TWD: "Taiwan",
  TZS: "Tanzania", UAH: "Ukraine", UGX: "Uganda", USD: "United States", UYU: "Uruguay",
  UZS: "Uzbekistan", VES: "Venezuela", VND: "Vietnam", VUV: "Vanuatu", WST: "Samoa",
  XAF: "Central African States", XCD: "Eastern Caribbean", XOF: "West African States",
  XPF: "French Polynesia", YER: "Yemen", ZAR: "South Africa", ZMW: "Zambia", ZWL: "Zimbabwe"
};

function RateTable({ rates }) {
  const [usdAmount, setUsdAmount] = useState(1);

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl p-6 max-w-5xl mx-auto mt-8">
      <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center gap-2">
        🌍 Exchange Rates
        <span className="text-base font-medium text-gray-600 ml-2">
          (USD convert to: {usdAmount})
        </span>
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-1 text-gray-700">
          Enter USD amount:
        </label>
        <input
          type="number"
          min="0"
          value={usdAmount}
          onChange={e => setUsdAmount(parseFloat(e.target.value) || 0)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full table-auto">
          <thead className="bg-blue-600 text-white text-sm">
            <tr>
              <th className="p-3 text-left">Country</th>
              <th className="p-3 text-right">Value</th>
              <th className="p-3 text-center">Currency</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(rates).map(([currency, rate], index) => (
              <tr
                key={currency}
                className={`${index % 2 === 0 ? 'bg-blue-50' : 'bg-white'} hover:bg-blue-100 transition`}
              >
                <td className="p-3 font-medium text-gray-700">
                  {currencyCountries[currency] || 'Unknown'}
                </td>
                <td className="p-3 text-right text-gray-800">
                  {(usdAmount * rate).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </td>
                <td className="p-3 text-center font-bold text-gray-900">{currency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6 italic">
        Data auto-updates from real-time API
      </p>
    </div>
  );
}

export default RateTable;
