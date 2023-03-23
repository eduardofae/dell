#include <stdlib.h>
#include <stdio.h>
#include <string.h>

# define NEWLINE "\n"
# define DIVISORIA ";"
# define NAMEMAX 60 

void parseFile(char *fileHandle, int *matrix, char nomes [][NAMEMAX]){
    FILE* file = fopen(fileHandle, "r");
    int numCidades = 0;
    char c;
    
    if(!file) return;

    int i = 0;
    while(fscanf(file, "%c", &c) != NEWLINE){
        if(c == DIVISORIA){
            nomes[numCidades][i] = c;
            i++;
        }
        else{
            numCidades++;
            i = 0;
        }
    }

    matrix = malloc(sizeof(int) * numCidades * numCidades);

    fclose(file);
}

int main (int argc, char *argv){
    int *matrix;
    char nomes[][NAMEMAX];
    parseFile(argv[1], matrix, nomes);
    return 0;
}