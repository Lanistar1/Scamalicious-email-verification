"use client"; // Ensure this is a client-side component

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'

export default function Verify() {
  const [status, setStatus] = useState(null); // Store the status of the API call
  const [isLoading, setIsLoading] = useState(true); // To track the loading state
  const [showModal, setShowModal] = useState(false); // To control the modal visibility
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const { code } = router.query; // Extract the 'code' from the URL query

    if (code) {
      const verifyEmail = async () => {
        try {
          const response = await fetch(
            `https://admin.thescamalicious.com/verify-email?code=${code}`,
            { method: "GET" }
          );

          if (response.ok) {
            setStatus("success");
          } else {
            setStatus("fail");
          }
        } catch (error) {
          setStatus("fail");
        } finally {
          setIsLoading(false); // Hide loader after verification
          setShowModal(true); // Show modal after verification is complete
        }
      };

      verifyEmail();
    }
  }, [router.isReady, router.query]);

  // Modal Component
  const Modal = ({ status }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-sm">
        {status === "success" ? (
          <p className="text-green-600 text-xl font-bold">
            Email Verified Successfully!
          </p>
        ) : (
          <p className="text-red-600 text-xl font-bold">
            Verification Failed. Please try again.
          </p>
        )}
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={() => setShowModal(false)} // Close modal button
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 relative">
      {/* Loader */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
          <div className="loader border-t-4 border-b-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}

      {/* Modal */}
      {showModal && <Modal status={status} />}

      <div className="bg-white shadow-lg rounded-lg p-8">
        <p>Verifying your email, please wait...</p>
      </div>
    </div>
  );
}
