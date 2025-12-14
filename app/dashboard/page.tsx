"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Performance {
  totalAssigned: number;
  completed: number;
  inProgress: number;
  completionRate: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<Performance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/performance", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setData(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  if (!data) {
    return <p className="p-6 text-red-500">Failed to load dashboard</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        📊 Volunteer Performance Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Assigned</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {data.totalAssigned}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-green-600">
            {data.completed}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>In Progress</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-yellow-600">
            {data.inProgress}
          </CardContent>
        </Card>
      </div>

      {/* Completion Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Completion Rate</CardTitle>
          <Badge variant="secondary">
            {data.completionRate}%
          </Badge>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={data.completionRate} />
          <p className="text-sm text-gray-500">
            Based on tasks assigned vs completed
          </p>
        </CardContent>
      </Card>
    </div>
  );
}