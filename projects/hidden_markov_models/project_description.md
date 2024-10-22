# HMM for Handwritten Digit Image Classification
Given 3 HMMs representing the 0, 1 and 7 digits and sequences of observations, our goal is to classify these observations according to the digits they represent: 0,1 or 7.

We will be coding the Viterbi algorithm from scratch.

This work is based on the coursework: TP Markov-HMM Télécom Paris par Laurence Likforman-Sulem, Morgan Buisson, David Perera

[Basic HMM Concepts](./hmm_basic_concepts.md) <br>
[The notebook containing all the code](./hmm_app_handwritten_digit_classification.ipynb)

## Data Representation and Model Representation
- The handwritten digits are a simplified version of the MNIST dataset.
- The image of a digit is represented by 5x28 pixels each of binary value.
- A digit is modelled by 5 states (from left to right). The states 1 and 5 represent background pixels of value 0. The states 2, 3 and 4 represent the beginning, the middle and the end of the digit.
- An observation is represented by a column of 5 pixels.
- A state can emit $2^5 = 32$ possible observations.

## HMM Models
- We have 3 HMM Models representing the 0, 1 and 7 digits. 
- Each model corresponds to 3 files, for example, for the 0 model:
    - **A0.txt** : hidden state transition probabilities (5 x 5 matrix)
    - **B0.txt** : observation probabilities (32 x 5 matrix)
    - **vect_pi0.txt**: probability of starting from each state (1 x 5 matrix)

## Sequence Representations
- The file __matrice_symboles.txt__ holds the observation vocabulary i.e. all the possible observations (5 x 32 matrix).
- A sequence of observations is represented by a sequence of numbers indicating the position of the observation in the vocabulary.
- We have 3 files: __SeqTest0.txt__, __SeqTest1.txt__ and __SeqTest7.txt__ each containing 10 sequences of the digits they represent.

## Classification of Handwritten Digit Images

### - Viterbi Algorithm
Given an HMM and a sequence, the Viterbi algorithm calculates the likelihood of the sequence by the given model.

## Conclusion
- We have classified 30 images into classes: 0, 1 or 7 (10 images per class) according to the digits they represent.
- With the HMM models we have been provided with, and our implementation of the Viterbi algorithm we obtained an accuracy score of **0.966**.