import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4 font-sans">
      <main className="card bg-base-100 shadow-2xl w-full max-w-3xl min-h-[80vh]">
        <div className="card-body flex flex-col justify-between items-center text-center p-8 sm:p-12">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-base-content">
              User Management System
            </h1>
          </div>

          {/* Content */}
          <div className="flex flex-col items-center gap-8 py-8">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold leading-tight text-base-content max-w-lg">
                Manage users easily —
                <span className="text-primary"> add, edit, delete,</span>
                and view with one click.
              </h2>
              <p className="text-lg leading-8 text-base-content/70 max-w-lg">
                This simple dashboard helps you manage all your users
                efficiently, without authentication — perfect for testing CRUD
                operations.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 w-full items-center">
            <Link
              href="/users"
              className="btn btn-primary btn-lg w-full max-w-xs gap-2 transition-all duration-200 hover:scale-105"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Go to Dashboard
            </Link>
            <p className="text-sm text-base-content/50 mt-2">
              No authentication required • Ready to use
            </p>
          </div>

          {/* Footer */}
          <footer className="mt-8 text-sm text-base-content/60">
            Built by <strong className="text-primary">NxSYED-ux</strong>
          </footer>
        </div>
      </main>
    </div>
  );
}
