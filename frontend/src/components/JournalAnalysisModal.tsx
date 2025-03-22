'use client';

import { useState } from 'react';
import { useAnalyzeJournal } from '@/hooks/useAnalyzeJournal';
import styled from 'styled-components';

const Backdrop = styled.div` /* modal styles */ `;
const Modal = styled.div` /* modal styles */ `;
const Spinner = styled.div` /* loader styles */ `;

export default function JournalAnalysisModal({ content, onClose }: { content: string, onClose: () => void }) {
  const { analyze, loading } = useAnalyzeJournal();
  const [result, setResult] = useState<string>('');

  const handleAnalyze = async () => {
    const summary = await analyze(content);
    setResult(summary);
  };

  return (
    <Backdrop>
      <Modal>
        <h2 className="text-xl font-bold mb-2">AI-Generated Suggestions</h2>
        {loading && <Spinner />}
        {!loading && result ? (
          <p className="text-white whitespace-pre-wrap">{result}</p>
        ) : (
          <button onClick={handleAnalyze} className="bg-blue-600 text-white px-4 py-2 rounded">
            Analyze Journal
          </button>
        )}
        <button onClick={onClose} className="mt-4 text-red-400">Close</button>
      </Modal>
    </Backdrop>
  );
}