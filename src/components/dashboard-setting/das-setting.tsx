"use client"
import React, { useState } from "react";

export default function DasbSetting() {
  const [user, setUser] = useState({
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    meal: false,
    payment: false,
    monthly: false,
  });

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleNotifChange = (key: string) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  return (
    <div className="p-5 ">
      <h1 className="text-2xl font-bold mb-1">Settings</h1>
      <p className="text-muted-foreground mb-6">Manage your account settings and preferences.</p>

      {/* User Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-1">User Settings</h2>
        <p className="text-muted-foreground mb-4">Manage your account information and preferences.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              name="name"
              value={user.name}
              onChange={handleUserChange}
              type="text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              className="w-full border rounded px-3 py-2"
              name="email"
              value={user.email}
              onChange={handleUserChange}
              type="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              className="w-full border rounded px-3 py-2"
              name="phone"
              value={user.phone}
              onChange={handleUserChange}
              type="tel"
            />
          </div>
          <button className="bg-[#FE9900] hover:bg-amber-600 text-white px-6 py-2 rounded font-medium mt-2">
            Save Changes
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-1">Notification Settings</h2>
        <p className="text-muted-foreground mb-4">Manage your notification preferences.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="space-y-4">
            <div>
              <div className="font-medium">Email Notifications</div>
              <div className="text-muted-foreground text-sm">Receive notifications via email</div>
            </div>
            <div>
              <div className="font-medium">Push Notifications</div>
              <div className="text-muted-foreground text-sm">Receive notifications on your device</div>
            </div>
            <div>
              <div className="font-medium">Meal Reminders</div>
              <div className="text-muted-foreground text-sm">Get reminders for upcoming meals</div>
            </div>
            <div>
              <div className="font-medium">Payment Reminders</div>
              <div className="text-muted-foreground text-sm">Get reminders for upcoming payments</div>
            </div>
            <div>
              <div className="font-medium">Monthly Reports</div>
              <div className="text-muted-foreground text-sm">Receive monthly expense reports</div>
            </div>
          </div>
          <div className="flex flex-col gap-6 items-end">
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only" checked={notifications.email} onChange={() => handleNotifChange('email')} />
              <span className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 transition-all duration-300 relative">
                <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${notifications.email ? 'translate-x-5' : ''}`}></span>
              </span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only" checked={notifications.push} onChange={() => handleNotifChange('push')} />
              <span className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 transition-all duration-300 relative">
                <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${notifications.push ? 'translate-x-5' : ''}`}></span>
              </span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only" checked={notifications.meal} onChange={() => handleNotifChange('meal')} />
              <span className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 transition-all duration-300 relative">
                <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${notifications.meal ? 'translate-x-5' : ''}`}></span>
              </span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only" checked={notifications.payment} onChange={() => handleNotifChange('payment')} />
              <span className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 transition-all duration-300 relative">
                <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${notifications.payment ? 'translate-x-5' : ''}`}></span>
              </span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only" checked={notifications.monthly} onChange={() => handleNotifChange('monthly')} />
              <span className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 transition-all duration-300 relative">
                <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${notifications.monthly ? 'translate-x-5' : ''}`}></span>
              </span>
            </label>
          </div>
        </div>
        <button className="bg-[#FE9900] hover:bg-amber-600 text-white px-6 py-2 rounded font-medium mt-6">
          Save Changes
        </button>
      </div>
    </div>
  );
}
