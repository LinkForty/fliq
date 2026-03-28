import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function Terms() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16 px-6">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-slate-500 text-sm mb-10">Effective March 18, 2026</p>

          <div className="space-y-8 text-slate-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">Acceptance of Terms</h2>
              <p>
                By downloading, installing, or using Fliq'd ("the App"), you agree to these Terms
                of Service. If you do not agree, do not use the App.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Description of Service</h2>
              <p>
                Fliq'd is an ephemeral messaging app that allows users to send secret messages that
                recipients reveal through physical gestures. Messages can be delivered via push
                notification or shareable link.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Acceptable Use</h2>
              <p>You agree not to use Fliq'd to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Send content that is illegal, threatening, harassing, or abusive</li>
                <li>Distribute malware or harmful content</li>
                <li>Impersonate another person</li>
                <li>Spam or send unsolicited messages</li>
                <li>Attempt to access another user's messages or data</li>
              </ul>
              <p className="mt-2">
                We reserve the right to terminate access for users who violate these terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Ephemeral Messaging</h2>
              <p>
                Fliq'd is designed around ephemeral messaging. Push-delivered messages are stored
                in encrypted form on our server and are deleted once opened or after 24 hours.
                Link-shared messages are deleted from our servers after delivery when the
                LinkForty SDK is connected. Messages on your device can be configured to
                auto-delete after reading.
              </p>
              <p className="mt-2">
                <strong>We do not guarantee message delivery or persistence.</strong> Messages may
                fail to deliver due to network issues, expired push tokens, or other technical
                factors. Do not rely on Fliq'd for critical communications.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Data &amp; Deletion</h2>
              <p>
                You may delete all local data at any time from the Settings screen. Push messages
                are automatically deleted from our server upon opening or after 24 hours. For
                server-side data deletion requests, contact{' '}
                <a href="mailto:support@linkforty.com" className="text-primary hover:underline">
                  support@linkforty.com
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Disclaimer of Warranties</h2>
              <p>
                The App is provided "as is" and "as available" without warranties of any kind,
                whether express or implied. We do not warrant that the App will be uninterrupted,
                error-free, or secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, SiteTransition LLC shall not be liable
                for any indirect, incidental, special, consequential, or punitive damages arising
                out of your use of the App.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Changes to Terms</h2>
              <p>
                We may update these terms from time to time. Continued use of the App after
                changes constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Contact</h2>
              <p>
                Questions about these terms? Contact us at{' '}
                <a href="mailto:support@linkforty.com" className="text-primary hover:underline">
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
