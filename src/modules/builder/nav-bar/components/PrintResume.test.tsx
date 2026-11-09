import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useResumeLanguageStore } from '@/stores/useResumeLanguageStore';
import { useSectionLayoutStore } from '@/stores/useSectionLayoutStore';
import { PrintResume } from './PrintResume';

vi.mock('../atoms', () => ({
  StyledButton: ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

describe('PDF export layout guard', () => {
  beforeEach(() => {
    useResumeLanguageStore.getState().setLanguage('en');
    useSectionLayoutStore.getState().setReorderMode(false);
    vi.spyOn(window, 'print').mockImplementation(() => {});
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      queueMicrotask(() => callback(0));
      return 1;
    });
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('prints a normal template without academic fit markers', () => {
    render(<PrintResume />);
    fireEvent.click(screen.getByRole('button', { name: 'Download as PDF' }));
    expect(window.print).toHaveBeenCalledOnce();
    expect(window.alert).not.toHaveBeenCalled();
  });

  it('waits for academic layout and preserves reorder cleanup before printing', async () => {
    useSectionLayoutStore.getState().setReorderMode(true);
    render(
      <>
        <div data-cv-fit-state="ready" />
        <div data-cv-fit-state="ready" />
        <PrintResume />
      </>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Download as PDF' }));
    await waitFor(() => expect(window.print).toHaveBeenCalledOnce());
    expect(useSectionLayoutStore.getState().isReorderMode).toBe(false);
    expect(window.alert).not.toHaveBeenCalled();
  });

  it.each(['overflow', 'pending'])('prevents printing when a page is %s', async (state) => {
    render(
      <>
        <div data-cv-fit-state="ready" />
        <div data-cv-fit-state={state} />
        <PrintResume />
      </>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Download as PDF' }));
    await waitFor(() => expect(window.alert).toHaveBeenCalledOnce());
    expect(window.print).not.toHaveBeenCalled();
  });

  it('explains the overflow in the document language', async () => {
    useResumeLanguageStore.getState().setLanguage('el');
    render(
      <>
        <div data-cv-fit-state="overflow" />
        <PrintResume />
      </>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Λήψη PDF' }));
    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining('δεν χωράει σε δύο σελίδες')
      )
    );
    expect(window.print).not.toHaveBeenCalled();
  });
});
