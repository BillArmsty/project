import { gql, useMutation } from "@apollo/client";

const ANALYZE_JOURNAL = gql`
  mutation AnalyzeJournal($input: AnalyzeJournalInput!) {
    analyzeJournal(input: $input) {
      summary
    }
  }
`;

export const useAnalyzeJournal = () => {
  const [analyzeJournal, { loading, error, data }] =
    useMutation(ANALYZE_JOURNAL);

  const analyze = async (content: string) => {
    const result = await analyzeJournal({
      variables: { input: { content } },
    });

    return result.data?.analyzeJournal?.summary ?? "";
  };

  return {
    analyze,
    loading,
    error,
    data,
  };
};
