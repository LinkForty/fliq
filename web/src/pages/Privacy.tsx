import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function Privacy() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16 px-6">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-navy mb-2">Privacy Policy</h1>
          <p className="text-gray-400 text-sm mb-10">Effective March 18, 2026</p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">Overview</h2>
              <p>
                Fliq is a secret message app built by SiteTransition LLC. We are committed to
                protecting your privacy. This policy explains what data we collect, how we use it,
                and your rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy mb-3">Device Registration</h2>
              <p>
                When you enable push notifications, we store the following on our server:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>A unique device identifier</li>
                <li>Your phone number</li>
                <li>Your push notification token</li>
                <li>Your device platform (iOS or Android)</li>
              </ul>
              <p className="mt-2">
                This information is used solely to deliver push notifications to your device. We do
                not share it with third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy mb-3">Message Storage</h2>
              <p>
                <strong>Push messages:</strong> When someone sends you a secret via push notification,
                the message content is temporarily stored on our server. It is permanently deleted the
                moment you open it, or automatically after 24 hours — whichever comes first.
              </p>
              <p className="mt-2">
                <strong>Link-based messages:</strong> Messages shared via link are encoded directly
                in the URL. They are never sent to or stored on our server.
              </p>
              <p className="mt-2">
                <strong>On your device:</strong> Messages are stored locally on your phone using
                on-device storage. They are never synced to the cloud. You can delete them at
                any time, and the app can be configured to automatically delete messages after
                reading or sending.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy mb-3">Analytics</h2>
              <p>
                Fliq optionally integrates with the LinkForty SDK for analytics. This integration
                is opt-in — you must manually connect it from the Settings screen by providing
                your own API key. When connected, anonymous usage events (e.g., app opened,
                message created) are sent to LinkForty. No message content is ever included
                in analytics data.
              </p>
              <p className="mt-2">
                If you do not connect the LinkForty SDK, no analytics data is collected or
                transmitted.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy mb-3">Data Sharing</h2>
              <p>
                We do not sell, rent, or share your personal information with third parties.
                We do not serve advertisements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy mb-3">Data Deletion</h2>
              <p>
                You can delete all local messages and reset the app at any time from the
                Settings screen. To request deletion of your device registration from our server,
                contact us at{' '}
                <a href="mailto:support@linkforty.com" className="text-brand-500 hover:underline">
                  support@linkforty.com
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy mb-3">Contact</h2>
              <p>
                If you have questions about this privacy policy, contact us at{' '}
                <a href="mailto:support@linkforty.com" className="text-brand-500 hover:underline">
                  support@linkforty.com
                </a>.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
