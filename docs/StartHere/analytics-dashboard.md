# InReach Data Dashboards: A Phased Approach

This document outlines a comprehensive data dashboard system for InReach. It is designed to provide actionable insights for internal analytics and to create compelling narratives for external fundraising efforts. The architecture is designed to be implemented in phases, leveraging the existing technology stack (React, Mantine, tRPC, Prisma) and open-source tools.

## Guiding Principles

- **Two Audiences, Two Experiences:** We will build two distinct but connected dashboard experiences: one for internal power users (`The Floodlight`) and one for external stakeholders (`The Storyteller`).
- **API-First:** A single, flexible data API will power both dashboards and modernize our existing CSV export functionality.
- **No Schema Changes:** All data will be sourced from the existing schema. Performance will be managed through efficient queries, database `VIEW`s, and `MATERIALIZED VIEW`s where necessary.
- **Open Source & Free Tier:** All proposed tooling will prioritize open-source or robust free-tier options to align with non-profit constraints.

---

## Dashboard 1: The Internal Analytics Dashboard ("The Floodlight")

- **Audience:** Data Admins, Program Managers, and internal power users.
- **Goal:** To provide a powerful, interactive tool for deep data exploration, quality monitoring, and operational awareness. This dashboard answers the question: _"What is the current state of our data and platform?"_

### Key Sections & Visualizations

1.  **Platform Vital Signs (KPIs)**

    - **What:** A series of large "KPI Cards" at the top of the page.
    - **Metrics:** Total Published Orgs, Total Published Services, Active Users (last 30 days), Total User Reviews.
    - **Insight:** Provides an immediate, at-a-glance understanding of the platform's overall health and scale. Each card should include a small "sparkline" to show the trend over the last 90 days.

2.  **Data Health & Quality**

    - **What:** A section dedicated to monitoring the integrity and completeness of the dataset.
    - **Visualizations:**
      - **Data Freshness (Bar Chart):** Groups organizations by their `lastVerified` date (e.g., "Verified < 6 months", "6-12 months", "> 1 year"). This creates an actionable list of organizations needing a verification check-in.
      - **Content Funnel (Pie Chart):** Shows the ratio of `published` vs. `unpublished` Organizations and Services. This helps visualize the content pipeline and approval backlog.
      - **Migration Review (Counter):** A simple count of records where `checkMigration` is true, representing an immediate to-do list for the data team.

3.  **Geographic & Service Landscape**

    - **What:** An interactive, multi-faceted view of service distribution.
    - **Visualizations:**
      - **Interactive Map (Leaflet or Mapbox GL JS):** The centerpiece of the dashboard. It will display a heatmap of service concentration by ZIP code (`postCode`). Filters will allow users to drill down by `Country` and `GovDist`.
      - **Services by Category (Treemap):** A hierarchical view of `ServiceCategory` distribution. The size of each block represents the number of services. This chart should be linked to the map; clicking a state on the map should update the treemap to show data for only that state.

4.  **User Engagement & Community Voice**
    - **What:** A section to understand how end-users are interacting with the platform.
    - **Visualizations:**
      - **New Users & Reviews (Line Chart):** A dual-axis line chart showing new user signups and new `OrgReview` submissions over time. This helps identify correlations and the impact of outreach campaigns.
      - **Top Saved Resources (Bar Chart):** A "Top 10" list of the most saved Organizations/Services from the `UserSavedList` table. This is a direct signal of what content users find most valuable.

---

## Dashboard 2: The Fundraising Dashboard ("The Storyteller")

- **Audience:** Grant Writers, Donors, Board Members, and the public.
- **Goal:** To tell a compelling, data-driven story about InReach's impact, the need it addresses, and the opportunity for support. This dashboard answers the question: _"Why is our work vital and worthy of investment?"_

### Narrative Structure & Visualizations

This dashboard will be structured as a narrative journey, guiding the viewer through four key chapters.

1.  **Chapter 1: The Scale of the Need**

    - **Concept:** Visually prove that "service deserts" exist and are a significant problem.
    - **Hero Visualization: The "Gap Map"**: An interactive map where a user can select a `ServiceCategory`. The map will then color-code regions (e.g., `GovDist` or counties) based on the number of available services. Regions with zero services will be starkly highlighted.
    - **Supporting Element: Actionable List**: A simple table listing the "Top 10 Underserved Regions" for the selected service, making the data immediately understandable.

2.  **Chapter 2: Our Reach & Impact**

    - **Concept:** Demonstrate the scale and breadth of the InReach network.
    - **Visualizations:**
      - **High-Level KPIs:** Prominently display "Total Verified Organizations," "Total Services Offered," and "Countries Served."
      - **Geographic Footprint:** Use the interactive map to show the concentration of partner organizations, providing a powerful visual of our global reach.

3.  **Chapter 3: Our Effectiveness & Quality**

    - **Concept:** Prove that InReach is a trusted, reliable, and high-quality resource.
    - **Visualizations:**
      - **The "Trust" Meter (User Reviews):** Showcase the total number of `OrgReview` entries and the average star `rating`. Include a small, curated feed of anonymized positive quotes from `reviewText`.
      - **The "Freshness" Gauge (Data Verification):** A simplified version of the Data Health chart, showing the percentage of data verified within the last year. This demonstrates a commitment to data integrity.

4.  **Chapter 4: The Opportunity to Help**
    - **Concept:** Create a direct, tangible link between a potential donation and a measurable outcome.
    - **Interactive Elements:**
      - **Impact Scenario Calculator:** A simple form where a user can input a dollar amount. The UI will then calculate and display the potential impact based on pre-defined metrics (e.g., "A grant of $25,000 could help us onboard 50 new organizations in these service deserts.").
      - **Sharable Views:** The dashboard's state (filters for category and location) will be stored in the URL. This allows a grant writer to create a specific view (e.g., "Legal Service Gaps in Arizona") and share a single link to that live, tailored dashboard.

---

## Phase 1: The Unified Data API (The Foundation)

This foundational phase focuses on building a single, robust data API to support both dashboards and modernize existing CSV exports.

- **Technology:** A new tRPC router (`dashboard.ts`) will be created to house all aggregation queries.
- **Key Endpoints:**
  - `getKpiMetrics`: Returns high-level platform statistics.
  - `getServiceDistribution`: Returns service counts grouped by category, with optional geographic filters.
  - `getGeoHeatmapData`: Returns geographic points and counts for map visualizations.
  - `getDataHealthStats`: Returns data for the internal data quality section.
  - `getServiceGaps`: Identifies regions with zero services for a given category.
  - `getDynamicReport`: A flexible endpoint that takes filter and grouping parameters to generate data for CSV exports (see below).
- **Performance:** Queries will be optimized using database indexes. For complex or slow aggregations, we will create `MATERIALIZED VIEW`s in PostgreSQL, which act as pre-calculated tables and can be refreshed on a schedule (e.g., nightly) without requiring schema changes.

### Data Caching Strategy (The "Snapshot" Approach)

To avoid hitting Vercel's execution limits and to ensure instant dashboard loading, we will use **PostgreSQL Materialized Views** for heavy aggregations.

1.  **The Mechanism:** A Materialized View stores the _result_ of a complex query as a physical table. It is not "live" data, but a snapshot.
2.  **The Workflow:**
    - **Create:** We define a view (e.g., `mv_service_stats`) in the database that pre-calculates the heavy grouping and counting logic.
    - **Query:** The dashboard API queries this view instantly via Prisma, treating it like a standard read-only table.
    - **Refresh:** We utilize **Vercel Cron Jobs** to trigger a refresh.
      - **Config:** A `vercel.json` file defines a schedule (e.g., `0 3 * * *` for 3 AM daily).
      - **Endpoint:** Vercel hits a secured API route (e.g., `/api/cron/refresh-analytics`).
      - **Action:** This route executes the SQL command `REFRESH MATERIALIZED VIEW CONCURRENTLY "mv_service_stats";`.
3.  **Benefit:** This decouples the dashboard loading speed from the complexity of the data analysis. The dashboard will always load in milliseconds, regardless of how much data we have.

---

## Modernizing CSV Exports

The current system of hard-coded CSV download APIs will be deprecated. Instead of creating more one-off endpoints, we will leverage the new Unified Data API.

- **How it Works:** The `dashboard.getDynamicReport` endpoint will accept a JSON object defining the desired filters (e.g., `country`, `serviceType`) and grouping fields (e.g., `zipCode`, `category`).
- **Frontend:** The existing "Download CSV" buttons will be refactored to call this single, flexible endpoint with the correct parameters.
- **Benefits:** This approach eliminates code duplication, makes adding new reports trivial (it's just a new set of parameters), and centralizes all reporting logic.

---

## Key Considerations & Next Steps

- **Data for "Service Deserts":** To truly define a "service desert," we may need to cross-reference our data with external population data (e.g., from census sources). This would be a future enhancement to show not just a lack of services, but a lack of services _for a significant population_.
- **User Permissions:** The internal dashboard must be strictly protected by the `dataPortalAdmin` role. The public fundraising dashboard will be read-only and will not expose any sensitive or non-public information.
- **Tooling Selection:**
  - **Charting:** `Recharts` is a strong choice due to its composability with React. `Nivo` is an excellent alternative for beautiful, out-of-the-box charts.
  - **Mapping:** `Leaflet` is a lightweight and powerful open-source mapping library. `Mapbox GL JS` offers more advanced features and has a generous free tier suitable for this project's scale.
- **Initial Focus:** The development should begin with **Phase 1 (The Data API)**, as it is the foundation for everything else. Concurrently, work can begin on the **Internal Analytics Dashboard**, as it will be the primary consumer of the new API endpoints.

---

## Public Implementation Strategy (For "The Storyteller")

To share data with funders and the public, we will create a dedicated, public-facing section of the site (e.g., `/impact`) that is highly performant and scalable.

- **Static Site Generation (SSG):** The public dashboard pages will be pre-rendered into static HTML at build time. This provides the fastest possible load times for visitors and puts zero load on the database for user requests.
- **Incremental Static Regeneration (ISR):** We will use Vercel's ISR capabilities to keep the data fresh.
  - A revalidation period (e.g., every 4 hours) will be set for the public dashboard page.
  - When a user visits the page after the revalidation period has expired, they will receive the stale (but still instant) static page.
  - This visit triggers a background process on Vercel to regenerate the page with fresh data from the database's `MATERIALIZED VIEW`s.
  - Once complete, the static page is updated on the CDN for all future visitors.
- **Dedicated Public API:**
  - To ensure security and a clear separation of concerns, we will create dedicated `publicProcedure`s in our tRPC router.
  - These procedures will be read-only and will only query the safe, pre-aggregated `MATERIALIZED VIEW`s. They will not have access to any sensitive data or filtering capabilities available to the internal dashboard.
- **Component Reusability:** The same React chart components (`<GeoMap />`, `<ServiceDistributionPieChart />`) built for the internal dashboard can be reused on the public pages. They will simply be hydrated with data from the public, static page props instead of live tRPC queries.

### The Complete Data Flow

1.  **Daily Cron Job:** A Vercel Cron Job runs `REFRESH MATERIALIZED VIEW` on the PostgreSQL database at 3 AM. The data is now fresh for the day.
2.  **Build Time:** During a new deployment, Next.js pre-renders the `/impact` page by fetching data from these materialized views, creating a static `impact.html`.
3.  **User Visit:** A user visits `/impact` and is instantly served the static HTML from Vercel's Edge Network.
4.  **Revalidation:** After 4 hours, a user visit triggers a background regeneration of the page, pulling the latest data from the materialized views.

---

## Implementation Checklist

### Phase 1: Foundational API & Components

- [x] **API:** Create `dashboard` tRPC router.
- [x] **API:** Implement `getKpiMetrics` endpoint.
- [x] **UI:** Create `KpiCards` presentational component.
- [x] **Page:** Create initial `/dashboard` page and display KPIs.
- [x] **API:** Implement `getDataHealthStats` endpoint for the Data Freshness chart.
- [x] **UI:** Create "Data Freshness" chart component.
- [ ] **Security:** Secure `/dashboard` page for admin users only.

### Phase 2: Internal Dashboard ("The Floodlight")

- [x] **Data Health:** Display "Data Freshness" chart.
- [ ] **Data Health:** Implement and display "Content Funnel" chart.
- [ ] **Data Health:** Implement and display "Migration Review" counter.
- [x] **Geo & Service:** Implement `getGeoHeatmapData` and `getServiceDistribution` endpoints.
- [x] **Geo & Service:** Implement interactive map and "Services by Category" treemap components.
- [ ] **Integration:** Connect `InteractiveMap` component to `getGeoHeatmapData` endpoint (replace `FAKE_GEO_DATA`).
- [ ] **Integration:** Connect `ServiceTreemap` component to `getServiceDistribution` endpoint (replace `FAKE_DATA`).
- [ ] **User Engagement:** Implement endpoints for user engagement statistics.
- [ ] **User Engagement:** Implement "New Users & Reviews" and "Top Saved Resources" charts.

### Phase 3: Fundraising Dashboard & Exports

- [ ] **Public Page:** Create public `/impact` page using SSG/ISR.
- [x] **Fundraising:** Implement "Gap Map," "Trust Meter," and "Impact Calculator" visualizations.
- [ ] **API:** Implement `getFundraisingStats` endpoint (reviews, verification counts).
- [ ] **Integration:** Connect `FundraisingView` component to `getFundraisingStats` endpoint (replace `FAKE_REVIEWS_DATA` and `FAKE_VERIFICATION_DATA`).
- [ ] **CSV Exports:** Implement `getDynamicReport` endpoint and refactor existing download buttons.

To successfully prompt Gemini to complete the remaining tasks (like the API endpoints), it is necessary to provide this document plus two critical pieces of context:

The Database Schema (schema.prisma): The document mentions tables like OrgReview, ServiceCategory, and UserSavedList, but without the actual Prisma schema, Gemini won't know the field names or relationships required to write the tRPC queries.
Existing Router Structure: To add new endpoints (like getFundraisingStats), Gemini needs to see where the tRPC routers are located (e.g., packages/api/src/router/dashboard.ts) to match the coding style and imports.
