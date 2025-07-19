import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import type { OCDSRelease, ReleasesResponse } from "@/types/ocds";

export function ReleasesPage() {
  const navigate = useNavigate();
  const [releases, setReleases] = useState<OCDSRelease[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFrom, setDateFrom] = useState("2024-01-01");
  const [dateTo, setDateTo] = useState("2025-07-19");
  const [pageSize, setPageSize] = useState("50");

  const loadReleases = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        PageNumber: currentPage.toString(),
        PageSize: pageSize,
        dateFrom,
        dateTo,
      });

      const response = await fetch(`/api/OCDSReleases?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ReleasesResponse = await response.json();
      setReleases(data.releases || []);
    } catch (err) {
      console.error("Error loading releases:", err);
      setError(
        `Error loading data: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReleases();
  }, [currentPage]);

  const handleLoadData = () => {
    setCurrentPage(1);
    loadReleases();
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleReleaseClick = (ocid: string) => {
    navigate(`/detail/${encodeURIComponent(ocid)}`);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Card className="mb-6">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">OCDS Releases</CardTitle>
          <CardDescription>
            South African Government Procurement Data
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-40"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-40"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Label>Page Size</Label>
              <Select value={pageSize} onValueChange={setPageSize}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="500">500</SelectItem>
                  <SelectItem value="1000">1000</SelectItem>
                  <SelectItem value="5000">5000</SelectItem>
                  <SelectItem value="10000">10000</SelectItem>
                  <SelectItem value="20000">20000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleLoadData} disabled={loading}>
              {loading ? "Loading..." : "Load Releases"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-6 border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-muted-foreground">
          Total: {releases.length}
        </span>
        <span className="text-sm text-muted-foreground">
          Page: {currentPage}
        </span>
      </div>

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </CardContent>
        </Card>
      ) : releases.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No releases found for the selected criteria.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 mb-6">
          {releases.map((release) => {
            const tender = release.tender || {};
            const tenderPeriod = tender.tenderPeriod || {};
            const procuringEntity = tender.procuringEntity || {};
            const buyer = release.buyer || {};

            return (
              <Card
                key={release.ocid}
                className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-primary"
                onClick={() => handleReleaseClick(release.ocid)}
              >
                <CardContent className="pt-6">
                  {tender.description && (
                    <div className="mb-4 pb-4 border-b">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {tender.description}
                      </p>
                    </div>
                  )}

                  <div className="grid gap-3">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {procuringEntity.name || buyer.name || "N/A"}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">
                        {tender.procurementMethodDetails ||
                          tender.procurementMethod ||
                          "N/A"}
                      </span>
                    </div>

                    <div className="flex flex-col text-sm">
                      <span>{formatDate(tenderPeriod.startDate)}</span>
                      <span>{formatDate(tenderPeriod.endDate)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={handleNextPage}
          disabled={releases.length < parseInt(pageSize)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
