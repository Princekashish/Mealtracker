"use client"

import { useRef, useState } from "react"
import { ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "../ui/Button"
import { useAuth } from "@/utils/Auth/AuthProvider"
import Image from "next/image"
import { Switch } from "../ui/switch"
import { useStore } from "@/lib/store"
import { toast, Toaster } from "sonner"

type TabType = "profile" | "preferences" | "security"


export function SettingsTabs() {
  const [activeTab, setActiveTab] = useState<TabType>("profile")
  const resetStore = useStore((state) => state.resetStore);

  // Profile state
  const { user } = useAuth();
  const [userDetail, setUserDetail] = useState({
    profile: user?.photoURL || "",
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Preferences state
  const [currency, setCurrency] = useState("INR")
  // const [timezone, setTimezone] = useState("GMT+5:30")
  const [mealNotifications, setMealNotifications] = useState(true)
  const [vendorUpdates, setVendorUpdates] = useState(false)
  const [recommendations, setRecommendations] = useState(true)

  // Security state
  const [twoFactorAuth, setTwoFactorAuth] = useState(true)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")


  const tabs = [
    { id: "profile" as TabType, label: "Edit Profile" },
    { id: "preferences" as TabType, label: "Preferences" },
    { id: "security" as TabType, label: "Security" },
  ]

  const handleSave = () => {
    alert("Settings saved successfully!")

  }
  //User Profile 
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setUserDetail((prev) => ({ ...prev, profile: result }))
      }
      reader.readAsDataURL(file)
    }
  }
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  //user name
  const handleChanges: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { id, value } = e.target;
    setUserDetail((pre) => ({ ...pre, [id]: value }))

  }
  const handleData = () => {
    resetStore();
    toast.success("Data has been removed")

  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-[#F59E0B] text-[#F59E0B] " : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* === PROFILE TAB === */}
      {activeTab === "profile" && (
        <div className="space-y-8 p-5 ">
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="mt-5">
              <div className="flex items-center gap-4  justify-start">
                <div className=" rounded-full ">
                  <Image src={userDetail.profile || "/default-profile.png"} loading="lazy" width={80} height={80} alt={userDetail.name} className="rounded-full h-20 w-20 object-cover" />
                </div>
                <div className="flex justify-start items-center flex-col ">
                  <Button
                    variant="outline"
                    onClick={triggerFileInput}
                    className="flex items-center gap-2 bg-background border-border hover:bg-accent"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Change Picture
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="text-base font-medium text-gray-900 dark:text-[#c9c9c9] ">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={userDetail.name}
                onChange={handleChanges}
                className="mt-2 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="Email" className="text-base font-medium text-gray-900 dark:text-[#c9c9c9]">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={userDetail.email}
                onChange={handleChanges}
                disabled
                className="mt-2 w-full px-4 py-2 bg-[#f2f2f2] dark:bg-zinc-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="text-base font-medium text-gray-900 dark:text-[#c9c9c9]">
                Phone Number
              </label>
              <input
                id="phone"
                type="text"
                placeholder="Enter your phone number"
                value={userDetail.phone}
                onChange={handleChanges}
                className="mt-2 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} variant="default" className="px-8">
              Save Changes
            </Button>
          </div>
        </div>
      )}

      {/* === PREFERENCES TAB === */}
      {activeTab === "preferences" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Currency */}
            <div className="">
              <label className="text-base font-medium text-gray-900 dark:text-[#c9c9c9]">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="mt-2 w-full px-4 py-2 border rounded-md focus:outline-none dark:bg-zinc-900"
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <label className="text-base font-medium text-gray-900 mb-4 block dark:text-[#c9c9c9]">Notifications</label>
            <div className="space-y-4  ">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-[#c9c9c9]">I send or receive meal payments</span>
                <Switch checked={mealNotifications} onCheckedChange={setMealNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-[#c9c9c9]">I receive vendor updates</span>
                <Switch checked={vendorUpdates} onCheckedChange={setVendorUpdates} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-[#c9c9c9]">There are recommendations for my meal plan</span>
                <Switch checked={recommendations} onCheckedChange={setRecommendations} />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} variant="default" className="px-8">
              Save Changes
            </Button>
          </div>
        </div>
      )}

      {/* === SECURITY TAB === */}
      {activeTab === "security" && (
        <div className="space-y-8">
          {/* Two-factor Auth */}
          <div>
            <label className="text-base font-medium text-gray-900 mb-4 block dark:text-[#c9c9c9]">Two-factor Authentication</label>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-[#c9c9c9]">Enable or disable two-factor authentication</span>
              <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
            </div>
            <div className="flex items-center justify-between mt-6">
              <span className="text-gray-700 dark:text-[#c9c9c9]">Delet you data</span>
              <Button variant={"default"} onClick={handleData} >Clear All Data</Button>
            </div>
          </div>

          {/* Password Change */}
          <div>
            <label className="text-base font-medium text-gray-900 mb-4 block dark:text-[#c9c9c9]">Change Password</label>
            <div className="space-y-4 max-w-md">
              <div>
                <label htmlFor="currentPassword" className="text-sm text-gray-700 dark:text-[#c9c9c9]">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  placeholder="**********"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="text-sm text-gray-700 dark:text-[#c9c9c9]">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  placeholder="**********"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} variant="default" className="px-8">
              Save Changes
            </Button>
          </div>
        </div>
      )}

      <Toaster position="top-right" />
    </div>
  )
}
