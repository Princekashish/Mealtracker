
import React from 'react'
import dynamic from 'next/dynamic'
const VendorsTable = dynamic(()=>import("@/components/vendor-details/vendors-table"))



export default function VendorsPage() {
  return <VendorsTable />
}
