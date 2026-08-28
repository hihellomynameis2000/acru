import { createFixtureListAdapter } from "@/components/data/adapter";

export type Customer = {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  location: string;
  createdAt: string;
  since: string;
  amount: string;
  card: string;
  verification: "Verified" | "Needs review";
};

const customers: Customer[] = [
  {
    id: "cus_8f30a40vne0",
    name: "Nathan Bariac",
    initials: "NB",
    email: "nathan.bariac@gmail.com",
    phone: "+1 (514) 555-0199",
    location: "Montreal, QC, Canada",
    createdAt: "July 30, 2026",
    since: "Since July 2017",
    amount: "$15.40",
    card: "3830",
    verification: "Verified"
  },
  {
    id: "cus_a71fc9a2fee",
    name: "Olivia Martin",
    initials: "OM",
    email: "olivia@northwind.co",
    phone: "+1 (212) 555-0128",
    location: "New York, NY, USA",
    createdAt: "July 30, 2026",
    since: "Since March 2021",
    amount: "$284.00",
    card: "1842",
    verification: "Verified"
  },
  {
    id: "cus_b62ac81a0d3",
    name: "Maya Chen",
    initials: "MC",
    email: "maya@riverlabs.io",
    phone: "+1 (415) 555-0164",
    location: "San Francisco, CA, USA",
    createdAt: "July 30, 2026",
    since: "Since September 2022",
    amount: "$129.50",
    card: "6251",
    verification: "Verified"
  },
  {
    id: "cus_c18de7b43f9",
    name: "Liam Carter",
    initials: "LC",
    email: "liam@atlasdesign.co",
    phone: "+44 20 7946 0118",
    location: "London, United Kingdom",
    createdAt: "July 30, 2026",
    since: "Since January 2020",
    amount: "$74.20",
    card: "9014",
    verification: "Verified"
  },
  {
    id: "cus_d81be45ac12",
    name: "Sofia Rodriguez",
    initials: "SR",
    email: "sofia@solstudio.mx",
    phone: "+52 55 5555 0182",
    location: "Mexico City, Mexico",
    createdAt: "July 30, 2026",
    since: "Since May 2023",
    amount: "$312.00",
    card: "4486",
    verification: "Needs review"
  },
  {
    id: "cus_e7a048be6c1",
    name: "Noah Williams",
    initials: "NW",
    email: "noah@foundry.team",
    phone: "+1 (305) 555-0106",
    location: "Miami, FL, USA",
    createdAt: "July 30, 2026",
    since: "Since August 2024",
    amount: "$96.75",
    card: "7210",
    verification: "Verified"
  },
  {
    id: "cus_f903ab1c3e4",
    name: "Emma Thompson",
    initials: "ET",
    email: "emma@cedarworks.ca",
    phone: "+1 (604) 555-0172",
    location: "Vancouver, BC, Canada",
    createdAt: "July 30, 2026",
    since: "Since April 2019",
    amount: "$45.00",
    card: "3328",
    verification: "Verified"
  },
  {
    id: "cus_17bd5fe881a",
    name: "Ethan Brooks",
    initials: "EB",
    email: "ethan@oakandmain.com",
    phone: "+1 (312) 555-0145",
    location: "Chicago, IL, USA",
    createdAt: "July 30, 2026",
    since: "Since November 2020",
    amount: "$19.99",
    card: "5092",
    verification: "Needs review"
  },
  {
    id: "cus_246ca1f29be",
    name: "Ava Johnson",
    initials: "AJ",
    email: "ava@daylight.studio",
    phone: "+1 (206) 555-0139",
    location: "Seattle, WA, USA",
    createdAt: "July 30, 2026",
    since: "Since February 2022",
    amount: "$680.00",
    card: "1077",
    verification: "Verified"
  },
  {
    id: "cus_395d711ce07",
    name: "Lucas Bernard",
    initials: "LB",
    email: "lucas@atelier.fr",
    phone: "+33 1 84 80 20 18",
    location: "Paris, France",
    createdAt: "July 30, 2026",
    since: "Since June 2021",
    amount: "$152.35",
    card: "2941",
    verification: "Verified"
  }
];

export const customerAdapter = createFixtureListAdapter<Customer>({
  filter: () => true,
  latency: 80,
  seed: customers
});
