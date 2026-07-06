class RankingService:
    """
    Re-ranks vector search results.
    """

    @staticmethod
    def rank(results):
        return sorted(results, key=lambda item: item.distance)