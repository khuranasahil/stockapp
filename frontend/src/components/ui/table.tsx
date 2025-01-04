import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm bg-primary-bg dark:bg-primary-bg", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead 
    ref={ref} 
    className={cn(
      "text-white divide-y divide-white/10",
      "[&_tr]:border-b border-white/10",
      "[&_tr:first-child]:bg-[hsl(var(--theme-table-header-primary))] dark:[&_tr:first-child]:bg-[hsl(var(--theme-table-header-alt))]",
      "[&_tr:not(:first-child)]:bg-[hsl(var(--theme-table-header-child-aqua))]",
      "[&_tr:not(:first-child):nth-child(2n)]:bg-[hsl(var(--theme-table-header-child-yellow))]",
      "[&_tr:not(:first-child):nth-child(3n)]:bg-[hsl(var(--theme-table-header-child-green))]",
      "[&_tr:not(:first-child):nth-child(4n)]:bg-[hsl(var(--theme-table-header-child-violet))]",
      "[&_tr:not(:first-child):nth-child(5n)]:bg-[hsl(var(--theme-table-header-child-turquoise))]",
      "[&_tr:not(:first-child):nth-child(6n)]:bg-[hsl(var(--theme-table-header-child-red))]",
      className
    )} 
    {...props} 
  />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-[#F3F3F2]/50 font-medium [&>tr]:last:border-b-0 dark:bg-[#262626]/50",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-[#EFEFEF] transition-colors hover:bg-[#F2F2F2]/50 data-[state=selected]:bg-[#F2F2F2] dark:border-[#515151] dark:hover:bg-[#333333]/50 dark:data-[state=selected]:bg-[#333333]",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-text-emphasize [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-2 align-middle text-text-body1 dark:text-text-body1 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-text-body2 dark:text-text-body2", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
