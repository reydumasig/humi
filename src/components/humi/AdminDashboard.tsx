import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CandidateLeadsDashboard } from "./CandidateLeadsDashboard";
import { JobPostingsAdmin } from "./JobPostingsAdmin";
import { ApplicationsAdmin } from "./ApplicationsAdmin";

export function AdminDashboard({ adminEmail }: { adminEmail?: string }) {
  return (
    <Tabs defaultValue="leads" className="mt-6">
      <TabsList>
        <TabsTrigger value="leads">Leads</TabsTrigger>
        <TabsTrigger value="jobs">Job postings</TabsTrigger>
        <TabsTrigger value="applications">Applications</TabsTrigger>
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
    </Tabs>
  );
}
