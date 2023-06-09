from sklearn.linear_model import Perceptron, SGDClassifier
import inspect
from sklearn.model_selection import train_test_split

model = Perceptron()
print(inspect.getsource(SGDClassifier.fit))