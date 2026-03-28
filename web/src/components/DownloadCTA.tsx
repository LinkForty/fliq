import { AppStoreBadges } from './AppStoreBadges';

export function DownloadCTA() {
  return (
    <section id="download" className="bg-navy text-white py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to send your first secret?
        </h2>
        <p className="text-gray-300 mb-10 text-lg">
          Download Fliq'd and start sharing secrets with a flick.
        </p>
        <AppStoreBadges />
      </div>
    </section>
  );
}
