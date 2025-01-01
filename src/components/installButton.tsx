"use client"
import { useEffect } from 'react';

// Declare the `BeforeInstallPromptEvent` type for TypeScript
interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

export default function InstallButton() {
  useEffect(() => {
    let deferredPrompt: BeforeInstallPromptEvent | undefined;
    const installButton = document.getElementById('installButton') as HTMLButtonElement | null;

    // Listen for the 'beforeinstallprompt' event
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault(); // Prevent the mini-infobar from appearing
      deferredPrompt = e as BeforeInstallPromptEvent;

      // Show your custom install button
      if (installButton) {
        installButton.style.display = 'block'; // Make the install button visible
        installButton.addEventListener('click', () => {
          if (deferredPrompt) {
            deferredPrompt.prompt(); // Show the install prompt
            deferredPrompt.userChoice.then((choiceResult) => {
              if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the installation');
              } else {
                console.log('User dismissed the installation');
              }
              deferredPrompt = undefined; // Reset the deferred prompt
            });
          }
        });
      }
    });

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('beforeinstallprompt', () => {});
    };
  }, []);

  return (
    <div>
      {/* Your custom install button */}
      <button id="installButton" style={{ display: 'none' }}>
        Install GymSync
      </button>
    </div>
  );
}
