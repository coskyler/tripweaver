"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import TourCard from "./TourCard";
import { auth } from "../../lib/firebase";

export default function ToursSection({
    owner,
    apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || "",
    className = "",
}) {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        async function waitForUser(maxRetries = 10, delay = 300) {
            for (let i = 0; i < maxRetries; i++) {
                const user = auth.currentUser;
                if (user) return user;
                await new Promise((r) => setTimeout(r, delay));
            }
            return null;
        }

        async function fetchTours() {
            try {
                setLoading(true);
                setError(null);

                const user = await waitForUser();
                if (!user) {
                    setLoading(false);
                    setError("You must be signed in to view your tours.");
                    return;
                }

                const token = await user.getIdToken();
                const url = `${apiDomain}/tours`;

                const res = await axios.get(url, {
                    signal: controller.signal,
                    headers: { Authorization: `Bearer ${token}` },
                    params: owner ? { owner } : undefined,
                });

                setTours(res.data || []);
            } catch (err) {
                if (axios.isCancel(err)) return;
                setError(err?.response?.data?.error || "Failed to fetch tours");
            } finally {
                setLoading(false);
            }
        }

        fetchTours();
        return () => controller.abort();
    }, [apiDomain, owner]);


    return (
        <section className={`w-full ${className}`}>
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-green-900">Your Tours</h2>
                <p className="mt-2 text-gray-600">
                    Explore your saved journeys and relive your favorite routes.
                </p>
            </div>


            {loading && (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-700">
                    Loading tours…
                </div>
            )}

            {error && !loading && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {!loading && !error && tours.length === 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-700">
                    No tours found yet.
                </div>
            )}

            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {tours.map((t) => (
                    <TourCard key={t.id} {...t} />
                ))}
            </div>
        </section>
    );
}
