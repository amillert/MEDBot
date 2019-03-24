from collections import Counter
from typing import List, Dict, Tuple, AnyStr, Any
# import numpy as np

from torch.utils.data import Dataset
from torch.tensor import Tensor

SENTENCE_PADDING = "<SEN-PAD>"
SENTENCE_BEGINNING = "<SEN-BEG>"
SENTENCE_END = "<SEN-END>"
SPECIAL_WORDS = [SENTENCE_PADDING, SENTENCE_BEGINNING, SENTENCE_END]


class PreparedData:
    """
    Prepared Data class is a class used for reading, preprocessing data
    and creating all the necessary and relevant data structures from it
    """
    def __init__(self, source: str) -> None:
        """
        Args:
            source (str): path to the tile, where data should be read from
        Returns:
            None
        """
        corpus = self._prepare_corpus(source)
        inputs, outputs = self._create_pairs_questions_answers(corpus)
        tokens, self.tokens_size = self._tokenize_corpus(corpus)
        vocab, self.vocab_size = self._create_vocabulary(tokens)
        self.word2cnt, self.word2freq = self._count_vocabulary_statistics(vocab)
        self._index_vocabulary(vocab)

    @staticmethod
    def _prepare_corpus(source: str) -> List[List[AnyStr]]:
        """
        Args:
            source (str): path to the file, where data should be read from
        Returns:
            corpus (List[List[AnyStr]]): text read, splitted and slightly processed
        """
        # corpus = []
        with open(source, "r") as file:
            corpus = [["".join([letter for letter in word if str.isalnum(letter)])
                       for word in message.lower().strip().split()]  # remove square brackets maybe?
                      for message in file.readlines()]
        print("Done reading and preparing corpus")
        # corpus = ["jeden text. i cos tam jeszcze", "cos nowego i cos jeszcze nowszego xd",
        #           "o co chodzi xd co?", "nowy text, co nie?"]
        # corpus = [["".join([letter for letter in word if str.isalnum(letter)])
        #            for word in message.lower().strip().split()]
        #           for message in corpus]
        # print("Done reading and preparing corpus")
        return corpus

    @staticmethod
    def _create_pairs_questions_answers(corpus: List[List[AnyStr]]):
        # ejemplo of getting rid of the last one and splitting these into pairs
        # getting rid of the last one since, there's no answer to this one
        l = [1, 2, 3, 4, 5]
        l.append(None)
        res = [x for x in zip(l[::2], l[1::2]) if None not in x]

        l = [1, 2, 3, 4, 5, 6]
        l.append(None)
        res = [x for x in zip(l[::2], l[1::2]) if None not in x]

        # according to: https://arxiv.org/pdf/1802.03393.pdf
        # avg length of message is 5.xx
        # so i guess we'll make the padding length - 6

    @staticmethod
    def _tokenize_corpus(corpus: List[List[AnyStr]]) -> Tuple[List[AnyStr], int]:
        """
        Args:
            corpus (List[List[AnyStr]]): text read, splitted and slightly processed
        Returns:
            tokens (List[AnyStr]): non-unique words (all) from corpus,
            len(tokens) (int): amount of tokens
        """
        # make sure tokens don't need SPECIAL_WORDS
        tokens = [flattened for unflattened in corpus for flattened in unflattened]
        print("Done tokenizing the corpus")
        return tokens, len(tokens)

    @staticmethod
    def _create_vocabulary(tokens: List[AnyStr]) -> Tuple[List[AnyStr], int]:
        """
        Args:
            vocab (List[AnyStr]): unique words from corpus
        Returns:
            len(vocab) (int): amount of unique words in vocabulary
        """
        vocab = SPECIAL_WORDS + sorted(list(set(tokens)))
        print("Done creating the vocabulary")
        return vocab, len(vocab)

    def _count_vocabulary_statistics(self, vocab: List[AnyStr]) -> (
            Tuple[Dict[AnyStr, int],
                  Dict[AnyStr, float]]):
        """
        Args:
            vocab (List[AnyStr]): unique words from corpus
        Returns:
            word2cnt (): dictionary mapping words to the amounts of their occurrences in corpus,
            word2freq (): dictionary mapping words to the frequencies of their occurrences in corpus
        """
        word2cnt = dict(Counter(vocab))
        word2freq = {word: cnt / self.tokens_size for word, cnt in word2cnt.items()}
        print("Done counting words and their occurrences' frequencies")
        return word2cnt, word2freq

    def _index_vocabulary(self, vocab: List[AnyStr]) -> None:
        """
        Args:
            vocab (List[AnyStr]): unique words from corpus
        Returns:
            None
        """
        # most probably both are not needed
        self.word2idx = {word: idx for idx, word in enumerate(vocab)}
        self.idx2word = {idx: word for idx, word in self.word2idx.items()}
        print("Done creating vocabulary dictionary & inverted dictionary")


class CustomDataset(Dataset):
    """
    Custom Dataset class is a class used to create dataset,
    which can then be used to create mini-batches using torch.utils.data.DataLoader
    """
    def __init__(self, source, max_sentence_length) -> None:
        self.max_sentence_length = max_sentence_length
        self.prepared_data = PreparedData(source)

    def __getitem__(self, idx: int) -> Tuple[Tensor, Tensor]:
        """
        Args:
            idx (int): index used to slice sample of the data
        Returns:
            self.x_data[idx] (Tensor): indexed sample of the self.x_data,
            self.y_data[idx] (Tensor): indexed sample of the self.y_data
        """
        return self.x_data[idx], self.y_data[idx]

    def __len__(self) -> int:
        """
        Returns:
            self.token.size (int): length of the whole dataset
        """
        return self.tokens_size  # check if it's enough
