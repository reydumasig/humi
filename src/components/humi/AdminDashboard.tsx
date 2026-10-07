import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CandidateLeadsDashboard } from "./CandidateLeadsDashboard";
import { JobPostingsAdmin } from "./JobPostingsAdmin";
import { ApplicationsAdmin } from "./ApplicationsAdmin";
import { HelpRequestsAdmin } from "./HelpRequestsAdmin";
import { TeamAdmin } from "./TeamAdmin";

export function AdminDashboard({
  adminEmail,
  adminRole,
}: {
  adminEmail?: string;
  adminRole?: "owner" | "admin";
}) {
  return (
    <Tabs defaultValue="leads" className="mt-6">
      <TabsList>
        <TabsTrigger value="leads">Leads</TabsTrigger>
        <TabsTrigger value="jobs">Job postings</TabsTrigger>
        <TabsTrigger value="applications">Applications</TabsTrigger>
        <TabsTrigger value="help">Help requests</TabsTrigger>
        {adminRole === "owner" && <TabsTrigger value="team">Team</TabsTrigger>}
      </TabsList>
      <TabsContent value="leads" className="mt-6">
        <CandidateLeadsDashboard adminEmail={adminEmail} />
      </TabsContent>
      <TabsContent value="jobs" className="mt-6">
        <JobPostingsAdmin />
      </TabsContent>
      <TabsContent value="applications" className="mt-6">
        <ApplicationsAdmin />
      </TabsContent>
      <TabsContent value="help" className="mt-6">
        <HelpRequestsAdmin />
      </TabsContent>
      {adminRole === "owner" && (
        <TabsContent value="team" className="mt-6">
          <TeamAdmin currentAdminEmail={adminEmail} />
        </TabsContent>
      )}
    </Tabs>
  );
}
