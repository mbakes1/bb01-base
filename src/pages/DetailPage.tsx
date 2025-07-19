import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { OCDSRelease } from "@/types/ocds";

export function DetailPage() {
  const { ocid } = useParams<{ ocid: string }>();
  const [release, setRelease] = useState<OCDSRelease | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ocid) {
      setError("No tender ID provided");
      setLoading(false);
      return;
    }

    const loadTenderDetail = async () => {
      try {
        const response = await fetch(`/api/OCDSReleases/release/${ocid}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: OCDSRelease = await response.json();
        setRelease(data);
      } catch (err) {
        console.error("Error loading tender detail:", err);
        setError(
          `Error loading tender details: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    loadTenderDetail();
  }, [ocid]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading tender details...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!release) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">No tender data found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tender = release.tender || {};
  const tenderPeriod = tender.tenderPeriod || {};
  const procuringEntity = tender.procuringEntity || {};
  const buyer = release.buyer || {};
  const documents = tender.documents || [];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Listings
              </Button>
            </Link>
            <div>
              <CardTitle>Tender Details</CardTitle>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="text-2xl">
            {tender.title || "Untitled Tender"}
          </CardTitle>
          <div className="flex gap-2 flex-wrap">
            <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium">
              OCID: {release.ocid}
            </span>
            {tender.id && (
              <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                ID: {tender.id}
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 border-b pb-1">
              Description
            </h3>
            <p className="text-muted-foreground">
              {tender.description || "No description available"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 border-b pb-1">
                Procuring Entity
              </h3>
              <p className="font-medium">
                {procuringEntity.name || buyer.name || "N/A"}
              </p>
              {procuringEntity.id && (
                <p className="text-sm text-muted-foreground">
                  ID: {procuringEntity.id}
                </p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 border-b pb-1">
                Procurement Details
              </h3>
              <div className="space-y-1">
                <p>
                  <span className="font-medium">Method:</span>{" "}
                  {tender.procurementMethodDetails ||
                    tender.procurementMethod ||
                    "N/A"}
                </p>
                <p>
                  <span className="font-medium">Category:</span>{" "}
                  {tender.mainProcurementCategory || "N/A"}
                </p>
                {tender.additionalProcurementCategories &&
                  tender.additionalProcurementCategories.length > 0 && (
                    <p>
                      <span className="font-medium">
                        Additional Categories:
                      </span>{" "}
                      {tender.additionalProcurementCategories.join(", ")}
                    </p>
                  )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 border-b pb-1">
                Tender Period
              </h3>
              <div className="space-y-1">
                <p>
                  <span className="font-medium">Start:</span>{" "}
                  {formatDate(tenderPeriod.startDate)}
                </p>
                <p>
                  <span className="font-medium">End:</span>{" "}
                  {formatDate(tenderPeriod.endDate)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 border-b pb-1">
                Release Information
              </h3>
              <div className="space-y-1">
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {formatDate(release.date)}
                </p>
                <p>
                  <span className="font-medium">Language:</span>{" "}
                  {release.language || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Tags:</span>{" "}
                  {release.tag ? release.tag.join(", ") : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {documents.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b pb-1">
                Documents ({documents.length})
              </h3>
              <div className="space-y-4">
                {documents.map((doc, index) => (
                  <Card key={doc.id || index} className="bg-muted/50">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium mb-2">
                            {doc.title || "Untitled Document"}
                          </h4>
                          {doc.description && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {doc.description}
                            </p>
                          )}
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>Format: {doc.format || "N/A"}</span>
                            <span>
                              Published: {formatDate(doc.datePublished)}
                            </span>
                            {doc.dateModified && (
                              <span>
                                Modified: {formatDate(doc.dateModified)}
                              </span>
                            )}
                          </div>
                        </div>
                        {doc.url && (
                          <Button size="sm" asChild>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
