export type DeviceSeries = {
  name: string;
  models: string[];
};

export type DeviceBrand = {
  brand: string;
  label: string;
  shortLabel: string;
  description: string;
  series: DeviceSeries[];
};

export const deviceCatalog: DeviceBrand[] = [
  {
    brand: 'Apple',
    label: 'Apple devices',
    shortLabel: 'Apple',
    description: 'iPhone, iPad, Apple Watch, and MacBook repair requests.',
    series: [
      {
        name: 'iPhone',
        models: ['iPhone 17 Pro Max', 'iPhone 17 Pro', 'iPhone 17', 'iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16', 'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14', 'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 11', 'iPhone XR', 'iPhone XS / XS Max', 'iPhone X', 'iPhone SE', 'Other iPhone']
      },
      { name: 'iPad', models: ['iPad Pro', 'iPad Air', 'iPad mini', 'iPad', 'Other iPad'] },
      { name: 'Apple Watch', models: ['Apple Watch Ultra', 'Apple Watch Series 10', 'Apple Watch Series 9', 'Apple Watch Series 8', 'Apple Watch SE', 'Other Apple Watch'] },
      { name: 'MacBook', models: ['MacBook Air', 'MacBook Pro', 'Other MacBook'] },
      { name: 'Other Apple device', models: ['Not sure / other Apple device'] }
    ]
  },
  {
    brand: 'Samsung',
    label: 'Samsung Galaxy',
    shortLabel: 'Samsung',
    description: 'Galaxy S, Note, A, Z Fold, and Z Flip repair requests.',
    series: [
      { name: 'S Series', models: ['Galaxy S26 Ultra', 'Galaxy S26 Plus', 'Galaxy S26', 'Galaxy S25 FE', 'Galaxy S25 Edge', 'Galaxy S25 Ultra', 'Galaxy S25 Plus', 'Galaxy S25', 'Galaxy S24 FE', 'Galaxy S24 Ultra', 'Galaxy S24 Plus', 'Galaxy S24', 'Galaxy S23 FE', 'Galaxy S23 Ultra', 'Galaxy S23 Plus', 'Galaxy S23', 'Galaxy S22 Ultra', 'Galaxy S22 Plus', 'Galaxy S22', 'Galaxy S21 FE', 'Galaxy S21 Ultra', 'Galaxy S21 Plus', 'Galaxy S21', 'Galaxy S20 FE', 'Galaxy S20 Ultra', 'Galaxy S20 Plus', 'Galaxy S20', 'Galaxy S10 Lite', 'Galaxy S10 5G', 'Galaxy S10 Plus', 'Galaxy S10', 'Galaxy S10e', 'Galaxy S9 Plus', 'Galaxy S9', 'Galaxy S8 Plus', 'Galaxy S8 Active', 'Galaxy S8', 'Galaxy S7 Edge', 'Galaxy S7 Active', 'Galaxy S7', 'Galaxy S6 Edge Plus', 'Galaxy S6 Edge', 'Galaxy S6 Active', 'Galaxy S6', 'Galaxy S5 Neo', 'Galaxy S5 Active', 'Galaxy S5', 'Galaxy S5 Mini', 'Galaxy S4 Active', 'Galaxy S4', 'Galaxy S4 Mini', 'Galaxy S3', 'Galaxy S3 Mini'] },
      { name: 'Note Series', models: ['Galaxy Note 20 Ultra', 'Galaxy Note 20', 'Galaxy Note 10 Plus', 'Galaxy Note 10 Lite', 'Galaxy Note 10', 'Galaxy Note 9', 'Galaxy Note 8', 'Galaxy Note 7', 'Galaxy Note 5', 'Galaxy Note 4', 'Galaxy Note 3', 'Galaxy Note 3 Neo', 'Galaxy Note 3 mini', 'Galaxy Note 2', 'Galaxy Note 1', 'Galaxy Note Edge'] },
      { name: 'A Series', models: ['A90 5G (A908 / 2019)', 'A9 Pro (A910 / 2016)', 'A9 (A920 / 2018)', 'A80 (A805 / 2019)', 'A8 Plus (A730 / 2018)', 'A8s (G887 / 2018)', 'A8 Star (G885 / 2018)', 'A8 (A810 / 2016)', 'A8 (A530 / 2018)', 'A73 5G (A736 / 2022)', 'A73 (A735 / 2022)', 'A72 (A725 / 2021)', 'A71 5G (A716 / 2020)', 'A71 (A715 / 2020)', 'A70S (A707 / 2019)', 'A70 (A705 / 2019)', 'A7 (A750 / 2018)', 'A7 (A720 / 2017)', 'A7 (A710 / 2016)', 'A60 (A606 / 2019)', 'A6 Plus (A605 / 2018)', 'A6 (A600 / 2018)', 'A57 5G (A576 / 2026)', 'A56 5G (A566 / 2025)', 'A55 (A556 / 2024)', 'A54 5G (A546 / 2023)', 'A53 5G (A536 / 2022)', 'A52s (A528 / 2021)', 'A52 5G (A526 / 2021)', 'A52 4G (A525 / 2021)', 'A51 5G (A516 / 2020)', 'A51 4G (A515 / 2019)', 'A50s (A507 / 2019)', 'A50 (A505 / 2019)', 'A5 (A520 / 2017)', 'A5 (A510 / 2016)', 'A5 (A500 / 2015)', 'A42 5G (A426 / 2020)', 'A41 (A415 / 2020)', 'A40S (A407 / 2019)', 'A40 (A405 / 2019)', 'A37 5G (A376 / 2026)', 'A36 5G (A366 / 2025)', 'A35 5G (A356 / 2024)', 'A34 5G (A346 / 2023)', 'A33 5G (A336 / 2022)', 'A32 5G (A326 / 2021)', 'A32 4G (A325 / 2021)', 'A31 (A315 / 2020)', 'A30s (A307 / 2019)', 'A30 (A305 / 2019)', 'A3 (A320 / 2017)', 'A3 (A310 / 2016)', 'A3 (A300 / 2015)', 'A26 5G (A266 / 2025)', 'A25 5G (A256 / 2023)', 'A24 (A245 / 2023)', 'A23 5G (A236 / 2022)', 'A23 (A235 / 2022)', 'A22 5G (A226 / 2021)', 'A22 4G (A225 / 2021)', 'A21s (A217 / 2020)', 'A21 (A215 / 2020)', 'A20s (A207 / 2019)', 'A20e (A202 / 2019)', 'A20 (A205 / 2019)', 'A17 5G (A176 / 2025)', 'A17 4G (A175 / 2025)', 'A16 5G (A166 / 2024)', 'A16 4G (A165 / 2024)', 'A15 5G (A156 / 2023)', 'A15 (A155 / 2023)', 'A14 5G (A146 / 2023)', 'A14 (A145 / 2023)', 'A13s (A137 / 2022)', 'A13 5G (A136 / 2021)', 'A13 (A135 / 2022)', 'A12 Nacho (A127 / 2021)', 'A12 (A125 / 2020)', 'A11 (A115 / 2020)', 'A10s (A107 / 2019)', 'A10e (A102 / 2019)', 'A10 (A105 / 2019)', 'A07 5G (A076 / 2026)', 'A07 4G (A075 / 2025)', 'A06 5G (A066 / 2025)', 'A06 (A065 / 2024)', 'A05S (A057 / 2023)', 'A05 (A055 / 2023)', 'A04S (A047 / 2022)', 'A04 (A045 / 2022)', 'A04E (A042 / 2022)', 'A03s (A037 / 2021)', 'A03 (A035 / 2021)', 'A03 Core (A032 / 2021)', 'A02s (A025 / 2020)', 'A2 Core (A260 / 2019)', 'A02 (A022 / 2020)', 'A01 Core (A013 / 2020)', 'A01 (A015 / 2020)'] },
      { name: 'Z Fold Series', models: ['Galaxy Z Fold 7 5G', 'Galaxy Z Fold 6 5G', 'Galaxy Z Fold 5 5G', 'Galaxy Z Fold 4 5G', 'Galaxy Z Fold 3 5G', 'Galaxy Z Fold 2 5G', 'Galaxy Fold 5G', 'Galaxy Fold 4G'] },
      { name: 'Z Flip Series', models: ['Galaxy Z Flip 7 FE 5G', 'Galaxy Z Flip 7 5G', 'Galaxy Z Flip 6 5G', 'Galaxy Z Flip 5 5G', 'Galaxy Z Flip 4 5G', 'Galaxy Z Flip 3 5G', 'Galaxy Z Flip 5G', 'Galaxy Z Flip 4G'] }
    ]
  },
  {
    brand: 'Motorola',
    label: 'Motorola',
    shortLabel: 'Moto',
    description: 'Moto G, E, Edge, Razr, One, Droid, and Z repair requests.',
    series: [
      { name: 'Moto G Series', models: ['Moto G17 Power (XT2623 / 2026)', 'Moto G17 (XT2623 / 2026)', 'Moto G77 (XT2621 / 2026)', 'Moto G67 (XT2621-2 / 2026)', 'G Power (XT2617 / 2026)', 'G Play (XT2615 / 2026)', 'G 5G (XT2613 / 2026)', 'G Stylus 5G (XT2619 / 2026)', 'G06 Power (XT2535-10 / 2025)', 'G06 (XT2535 / 2025)', 'G57 (XT2537 / 2025)', 'G67 Power 5G (XT2533 / 2025)', 'G96 (XT2531 / 2025)', 'G56 5G (XT2529 / 2025)', 'G86 (XT2527 / 2025)', 'G05 (XT2523 / 2025)', 'G15 Power (XT2521-5 / 2025)', 'G15 (XT2521 / 2025)', 'G Stylus 5G (XT2517 / 2025)', 'G Power (XT2515 / 2025)', 'G 5G (XT2513 / 2025)', 'G75 5G (XT2437 / 2024)', 'G55 5G (XT2435 / 2024)', 'G35 (XT2433 / 2024)', 'G64 5G (XT2431 / 2024)', 'G85 (XT2427 / 2024)', 'G24 Power (XT2425 / 2024)', 'G24 (XT2423 / 2024)', 'G04 / G04s (XT2421 / 2024)', 'G Stylus 5G (XT2419 / 2024)', 'G 5G (XT2417 / 2024)', 'G Power 5G (XT2415 / 2024)', 'G Play (XT2413 / 2024)', 'G45 5G (XT2369 / 2024)', 'G34 (XT2363 / 2023)', 'G84 (XT2347 / 2023)', 'G14 (XT2341 / 2023)', 'G54 (XT2343 / 2023)', 'G53 (XT2335 / 2022)', 'G23 (XT2333 / 2023)', 'G13 (XT2331 / 2023)', 'G Stylus 4G (XT2317 / 2023)', 'G Stylus 5G (XT2315 / 2023)', 'G 5G (XT2313 / 2023)', 'G Power 5G (XT2311 / 2023)', 'G Play (XT2271 / 2023)', 'G73 (XT2237 / 2022)', 'G32 (XT2235 / 2022)', 'G42 (XT2233 / 2022)', 'G22 (XT2231 / 2022)', 'G82 5G (XT2225-1 / 2022)', 'G71S (XT2225-2 / 2022)', 'G62 5G (XT2223 / 2022)', 'G52 (XT2221 / 2022)', 'G Stylus 5G (XT2215 / 2022)', 'G 5G (XT2213 / 2022)', 'G Stylus 4G (XT2211 / 2022)', 'G200 5G (XT2175 / 2022)', 'G31 (XT2173 / 2021)', 'G51 5G (XT2171 / 2021)', 'G71 5G (XT2169 / 2022)', 'G Power (XT2165 / 2022)', 'G41 (XT2167 / 2022)', 'G Pure (XT2163 / 2021)', 'G50 5G (XT2149 / 2021)', 'G40 Fusion (XT2147 / 2021)', 'G50 (XT2137 / 2021)', 'G60 (XT2135 / 2021)', 'G60S (XT2133 / 2021)', 'G Stylus 5G (XT2131 / 2021)', 'G30 (XT2129 / 2021)', 'G20 (XT2128 / 2021)', 'G10 Power (XT2127-4 / 2021)', 'G10 (XT2127-2 / 2021)', 'G100 (XT2125 / 2021)', 'G Power (XT2117 / 2021)', 'G Stylus 6.8 in (XT2115 / 2021)', 'G 5G (XT2113 / 2020)', 'G Play (XT2093 / 2021)', 'G9 Power (XT2091 / 2020)', 'G9 Plus (XT2087 / 2020)', 'G9 Play (XT2083 / 2020)', 'G9 (XT2083 / 2020)', 'G 5G Plus (XT2075 / 2020)', 'G8 Power Lite (XT2055 / 2020)', 'G8 (XT2045-1 / 2020)', 'G Fast (XT2045-3 / 2020)', 'G Stylus 6.4 in (XT2043 / 2020)', 'G Power (XT2041-4 / 2020)', 'G8 Power (XT2041-1 / 2020)', 'G8 Plus (XT2019 / 2019)', 'G8 Play (XT2015 / 2019)', 'G7 Plus (XT1965 / 2019)', 'G7 (XT1962 / 2019)', 'G7 Supra (XT1955-5 / 2019)', 'G7 Power (XT1955 / 2019)', 'G7 Play (XT1952 / 2019)', 'G6 Plus (XT1926 / 2018)', 'G6 (XT1925 / 2018)', 'G6 Play (XT1922 / 2018)', 'G5S Plus (XT1806 / 2017)', 'G5S (XT1793 / 2017)', 'G5 Plus (XT1687 / 2017)', 'G5 (XT1670 / 2017)', 'G4 Plus (XT1644 / 2016)', 'G4 (XT1625 / 2016)', 'G4 Play (XT1607 / 2016)', 'G3 (XT1540 / 2015)', 'G2 (XT1068 / 2014)', 'G (XT1032 / 2013)'] },
      { name: 'Moto E Series', models: ['E15 (XT2523-6 / 2025)', 'E13 (XT2345 / 2023)', 'E22i (XT2239 / 2022)', 'E22 (XT2239 / 2022)', 'E32S (XT2229 / 2022)', 'E32 (XT2227 / 2022)', 'E40 (XT2159 / 2021)', 'E30 (XT2158 / 2021)', 'E20 (XT2155 / 2021)', 'E7i Power (XT2097-12 / 2021)', 'E7 Power (XT2097 / 2021)', 'E7 (XT2095 / 2020)', 'E7 Plus (XT2081 / 2020)', 'E6i (XT2053-5 / 2021)', 'E6S (XT2053-1 / 2020)', 'E (XT2052 / 2020)', 'E6 Play (XT2029 / 2019)', 'E6 Plus (XT2025 / 2019)', 'E6 (XT2005 / 2019)', 'E5 (XT1920 / 2018)', 'E5 (XT1944 / 2018)', 'E5 Supra (XT1924-6 / 2018)', 'E5 Plus (XT1924 / 2018)', 'E5 Play Go (XT1921 / 2018)', 'E5 Play / E5 Cruise (XT1921 / 2018)', 'E4 Plus (XT1774 / 2017)', 'E4 (XT1763 / 2017)', 'E2 (XT1527 / 2015)', 'E (XT1022 / 2014)'] },
      { name: 'Moto Edge Series', models: ['Edge 70 Fusion Plus (XT2605 / 2026)', 'Edge 70 Fusion (XT2605 / 2026)', 'Edge 70 (XT2601 / 2025)', 'Edge (XT2519 / 2025)', 'Edge 60 Stylus (XT2517-4 / 2025)', 'Edge 60 Pro (XT2507 / 2025)', 'Edge 60 (XT2505 / 2025)', 'Edge 60 Fusion (XT2503 / 2025)', 'Edge 50 Fusion 5G (XT2429 / 2024)', 'Edge S50 (XT2409 / 2024)', 'Edge 50 Neo (XT2409 / 2024)', 'Edge 50 (XT2407-3 / 2024)', 'Edge (XT2405 / 2024)', 'Edge 50 Pro (XT2403 / 2024)', 'Edge 50 Ultra (XT2401-2 / 2024)', 'Edge 40 Neo (XT2307-1 / 2023)', 'Edge (XT2305 / 2023)', 'Edge 40 (XT2303-2 / 2023)', 'Edge Plus / Edge 40 Pro (XT2301 / 2023)', 'Edge 30 Neo (XT2245-1 / 2022)', 'Edge 30 Fusion (XT2243 / 2022)', 'Edge (XT2205-1 / 2022)', 'Edge 30 (XT2203 / 2022)', 'Edge Plus / Edge 30 Pro (XT2201-1/4 / 2022)', 'Edge 30 Ultra (XT2201 / 2022)', 'Edge X30 5G (XT2201-2/6 / 2021)', 'Edge 20 Pro (XT2153-1 / 2021)', 'Edge 20 (XT2143 / 2021)', 'Edge 5G (XT2141 / 2021)', 'Edge 20 Fusion (XT2139-2 / 2021)', 'Edge 20 Lite (XT2139-1 / 2021)', 'Edge 5G (XT2063 / 2020)', 'Edge Plus (XT2061 / 2020)'] },
      { name: 'Razr Series', models: ['Razr 70, Razr (XT2657 / 2026)', 'Razr 60 Pro, Razr Plus (XT2557 / 2025)', 'Razr 60, Razr (XT2553 / 2025)', 'Razr 60 Ultra, Razr Plus (XT2551 / 2025)', 'Razr 50, Razr (XT2453 / 2024)', 'Razr 50 Ultra, Razr Plus (XT2451 / 2024)', 'Razr 40, Razr (XT2323 / 2023)', 'Razr 40 Ultra, Razr Plus (XT2321 / 2023)', 'Razr 5G (XT2251 / 2022)', 'Razr 5G (XT2071 / 2020)', 'Razr (XT2000 / 2019)'] },
      { name: 'Moto One Series', models: ['One 5G Ace (XT2113 / 2021)', 'One 5G (XT2075-1 / 2020)', 'One Fusion (XT2073 / 2020)', 'One Fusion Plus (XT2067 / 2020)', 'One Hyper (XT2027 / 2019)', 'One Zoom (XT2010 / 2019)', 'One Macro (XT2016 / 2019)', 'One Action (XT2013 / 2019)', 'One Vision Plus (XT1970-1 / 2020)', 'One Vision (XT1970 / 2019)', 'One (XT1943 / 2018)', 'One Power (XT1942 / 2018)', 'One (XT1941 / 2018)'] },
      { name: 'Droid Series', models: ['Droid Turbo 2 (XT1585 / 2015)', 'Droid Maxx 2 (XT1565 / 2015)', 'Droid Turbo (XT1254 / 2014)', 'Droid Maxx (XT1080 / 2013)', 'Droid Mini (XT1030 / 2013)'] },
      { name: 'Moto Z Series', models: ['Z4 (XT1980 / 2019)', 'Z3 Play (XT1929 / 2018)', 'Z3 (XT1929-17 / 2018)', 'Z2 Force (XT1789 / 2017)', 'Z2 Play (XT1710 / 2017)', 'Z Force Droid (XT1650-02 / 2016)', 'Z Droid (XT1650-01 / 2016)', 'Z Play Droid (XT1635-01 / 2016)'] }
    ]
  },
  {
    brand: 'Google Pixel',
    label: 'Google Pixel',
    shortLabel: 'Pixel',
    description: 'Pixel phones and foldables from Pixel 10 through original Pixel.',
    series: [
      { name: 'Pixel', models: ['Pixel 10a', 'Pixel 10 Pro Fold', 'Pixel 10 Pro XL', 'Pixel 10 Pro', 'Pixel 10', 'Pixel 9a', 'Pixel 9 Pro XL', 'Pixel 9 Pro Fold', 'Pixel 9 Pro', 'Pixel 9', 'Pixel 8a', 'Pixel 8 Pro', 'Pixel 8', 'Pixel Fold', 'Pixel 7a', 'Pixel 7 Pro', 'Pixel 7', 'Pixel 6a', 'Pixel 6 Pro', 'Pixel 6', 'Pixel 5A 5G', 'Pixel 5', 'Pixel 4a 5G', 'Pixel 4a', 'Pixel 4 XL', 'Pixel 4', 'Pixel 3a XL', 'Pixel 3a', 'Pixel 3 XL', 'Pixel 3', 'Pixel 2 XL', 'Pixel 2', 'Pixel XL', 'Pixel'] }
    ]
  },
  {
    brand: 'Other / not sure',
    label: 'Other device / not sure',
    shortLabel: 'Other',
    description: 'Use this when the exact brand or model is not listed.',
    series: [
      { name: 'Not listed', models: ['Other phone / not sure', 'Other tablet / not sure', 'Device not listed'] }
    ]
  }
];

export const getBrandTotalModels = (brand: DeviceBrand) => brand.series.reduce((total, group) => total + group.models.length, 0);
