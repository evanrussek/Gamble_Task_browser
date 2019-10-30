#setwd("/Users/evanrussek/uws_jsp/data")
setwd("C:/Users/erussek/uws_jsp/data")

library(dplyr)
library(tidyr)
library(ggplot2)
library(reshape2)
library(zoo)
library(ggthemes)
library(GGally)

data <- read.csv("evan_practice_new.csv")
print(colnames(data))

cdf <- data %>%
  filter(grepl("CHOICE", phase)) %>%
  mutate(choice = chosen_machine, outcome = outcome_reached,
         correct_me =  1*(correct_response == "TRUE"), CA = C1, CB = C2,
         rt = as.numeric(as.character(rt))) %>%
  unite("CN", CA, CB) %>%
  mutate(C_best = case_when(
    o1_val > o2_val ~ 1,
    o1_val < o2_val ~ 2
  ),
  gain = case_when(o1_val > 0 | o2_val > 0 ~ 1,
                   o1_val < 0 | o2_val < 0 ~ 0)) %>%
  select(choice, outcome, correct_me, correct, correct_response, rt, C1, C2, CN, C_best, gain, o1_val, o2_val)

ntrials <- dim(cdf)[1]

# how many trial types did we do of each gruop?
cdf %>% group_by(CN) %>% tally() # looks like the 3 vs 4 comp got left out... fixed this...
cdf <- cdf %>% mutate(TN = row_number()) %>%
    group_by(CN) %>% 
  mutate(RN = row_number(), 
  avg_corr = rollmean(correct_me, 5, na.pad = TRUE, align = "right"))
  #//looks like the 3 vs 4 comp got left out... fixed this...


ggplot(cdf, aes(x= RN, y = correct_me, color = CN)) +
  geom_point() + geom_line(aes(y = avg_corr), size = 1.2) +
  facet_wrap(~ CN)

# add in a 6th run of that... 

cdf %>% select(correct_me, rt) %>%
  ggpairs()

