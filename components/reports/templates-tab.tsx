// components/reports/templates-tab.tsx

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Filter, FileText, FileSpreadsheet } from "lucide-react"
import { REPORT_TEMPLATES } from "./reports-constants"

export function TemplatesTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {REPORT_TEMPLATES.map((template) => (
          <Card
            key={template.id}
            className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-[16px] [corner-shape:squircle] bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {template.category}
                </Badge>
              </div>
              <div className="mt-4">
                <h3 className="font-medium">{template.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {template.description}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Last: {new Date(template.lastGenerated).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <FileSpreadsheet className="mr-1 h-4 w-4" />
                    Excel
                  </Button>
                  <Button variant="ghost" size="sm">
                    <FileText className="mr-1 h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
